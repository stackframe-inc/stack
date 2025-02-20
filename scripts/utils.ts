import fs from "fs";

export const COMMENT_LINE = "THIS FILE IS AUTO-GENERATED FROM TEMPLATE. DO NOT EDIT IT DIRECTLY";


export function processMacros(content: string, envs: string[]): string {
  const lines = content.split('\n');
  const result: string[] = [];

  // Each element in skipStack can be either:
  //
  // 1) A string like "NEXT_LINE", meaning skip exactly the next line.
  //
  // 2) An object of the form:
  //       { 
  //         type: 'IF_BLOCK',
  //         parentActive: boolean,
  //         hasMatched: boolean,
  //         isActive: boolean
  //       }
  //
  //    - parentActive = whether the block's parent is active. If false, this block can never produce output.
  //    - hasMatched   = if any branch in this block has matched so far (IF_PLATFORM or ELSE_IF).
  //    - isActive     = if the *current branch* in this block is active right now.
  //
  interface IFBlockState {
    type: 'IF_BLOCK';
    parentActive: boolean;
    hasMatched: boolean;
    isActive: boolean;
  }

  const skipStack: Array<string | IFBlockState> = [];

  /**
   * Returns the top IF_BLOCK on the stack or null if none.
   */
  function getCurrentIFBlock(): IFBlockState | null {
    for (let i = skipStack.length - 1; i >= 0; i--) {
      const top = skipStack[i];
      if (typeof top !== 'string' && top.type === 'IF_BLOCK') {
        return top;
      }
    }
    return null;
  }

  /**
   * Check if we should output the current line (based on skipStack).
   */
  function shouldOutputLine(): boolean {
    // If there's a "NEXT_LINE" on top, we skip this line.
    // (We'll remove that NEXT_LINE after we handle this line.)
    for (let i = skipStack.length - 1; i >= 0; i--) {
      if (skipStack[i] === 'NEXT_LINE') {
        return false;
      }
    }

    // If any IF_BLOCK up the stack is not active, or its parent is not active, we skip.
    for (let i = skipStack.length - 1; i >= 0; i--) {
      const top = skipStack[i];
      if (typeof top !== 'string' && top.type === 'IF_BLOCK') {
        if (!top.parentActive || !top.isActive) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Consume a single-use "NEXT_LINE" skip once we've decided about output.
   */
  function consumeNextLineIfPresent() {
    const top = skipStack[skipStack.length - 1];
    if (top === 'NEXT_LINE') {
      skipStack.pop();
    }
  }

  /**
   * Parse environment tokens from a directive substring (the part after IF_PLATFORM, ELSE_IF_PLATFORM, etc.).
   * We do a basic split on whitespace, then remove punctuation except for letters/numbers/hyphens.
   */
  function parseEnvList(envString: string): string[] {
    return envString
      .split(/\s+/)
      .map((e) => e.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''))
      .filter(Boolean);
  }

  /**
   * We define flexible regexes that look for these directives *anywhere* in the line:
   *   - IF_PLATFORM
   *   - ELSE_IF_PLATFORM
   *   - ELSE_PLATFORM
   *   - END_PLATFORM
   *   - NEXT_LINE_PLATFORM
   *
   * And then capture everything after that keyword up to the end of the line.
   *
   * Examples:
   *   "blah blah IF_PLATFORM env1 env2 ???"  => captures "env1 env2 ???"
   *   "adsfasdf ELSE_PLATFORM blabla"         => captures "blabla"
   */
  const reBeginOnly = /\bIF_PLATFORM\s+(.+)/i;
  const reElseIf    = /\bELSE_IF_PLATFORM\s+(.+)/i;
  const reElse      = /\bELSE_PLATFORM\b/i;
  const reEndOnly   = /\bEND_PLATFORM\b/i;
  const reNextLine  = /\bNEXT_LINE_PLATFORM\s+(.+)/i;

  for (const line of lines) {
    // 1) Try detecting IF_PLATFORM ...
    const beginMatch = line.match(reBeginOnly);
    if (beginMatch) {
      const parentBlock = getCurrentIFBlock();
      // If parentActive = false or isActive = false => entire sub-block is inactive
      const parentIsFullyActive =
        !parentBlock ? true : (parentBlock.parentActive && parentBlock.isActive);

      if (!parentIsFullyActive) {
        // Just push an inactive block so we handle nested macros correctly
        skipStack.push({
          type: 'IF_BLOCK',
          parentActive: false,
          hasMatched: false,
          isActive: false
        });
      } else {
        const envList = parseEnvList(beginMatch[1]); // e.g. "env1 env2 ???"
        const matched = envList.some((e) => envs.includes(e));
        skipStack.push({
          type: 'IF_BLOCK',
          parentActive: true,
          hasMatched: matched, 
          isActive: matched
        });
      }
      // Skip output of the directive line
      continue;
    }

    // 2) Try detecting ELSE_IF_PLATFORM ...
    const elseIfMatch = line.match(reElseIf);
    if (elseIfMatch) {
      const block = getCurrentIFBlock();
      if (block) {
        if (!block.parentActive) {
          // Parent block is inactive => do nothing
        } else {
          // If block.hasMatched is true, we've already used an if/else if
          // If not, we check if the environment matches
          if (block.hasMatched) {
            block.isActive = false;
          } else {
            const envList = parseEnvList(elseIfMatch[1]);
            const matched = envList.some((e) => envs.includes(e));
            if (matched) {
              block.hasMatched = true;
              block.isActive = true;
            } else {
              block.isActive = false;
            }
          }
        }
      }
      // Skip output
      continue;
    }

    // 3) Try detecting ELSE_PLATFORM ...
    const elseMatch = line.match(reElse);
    if (elseMatch) {
      const block = getCurrentIFBlock();
      if (block) {
        if (!block.parentActive) {
          // Still nothing
        } else {
          // If we haven't matched anything yet, now we become active
          if (!block.hasMatched) {
            block.hasMatched = true;
            block.isActive = true;
          } else {
            // Already matched something, so skip
            block.isActive = false;
          }
        }
      }
      // Skip line
      continue;
    }

    // 4) Try detecting END_PLATFORM ...
    const endMatch = line.match(reEndOnly);
    if (endMatch) {
      // Pop the top IF_BLOCK
      const top = skipStack[skipStack.length - 1];
      if (typeof top !== 'string' && top.type === 'IF_BLOCK') {
        skipStack.pop();
      }
      // Skip line
      continue;
    }

    // 5) Try detecting NEXT_LINE_PLATFORM ...
    const nextLineMatch = line.match(reNextLine);
    if (nextLineMatch) {
      const envList = parseEnvList(nextLineMatch[1]);
      const matched = envList.some((e) => envs.includes(e));
      if (!matched) {
        skipStack.push('NEXT_LINE');
      }
      // Skip line
      continue;
    }

    // If it's a normal line:
    if (shouldOutputLine()) {
      result.push(line);
    }

    // If the top of the stack is NEXT_LINE, consume it once
    consumeNextLineIfPresent();
  }

  return result.join('\n');
}
 
export function writeFileSyncIfChanged(path: string, content: string): void {
  if (fs.existsSync(path)) {
    const existingContent = fs.readFileSync(path, "utf-8");
    if (existingContent === content) {
      return;
    }
  }
  fs.writeFileSync(path, content);
}
