import fs from "fs";
import path from "path";


export const COMMENT_LINE = "THIS FILE IS AUTO-GENERATED FROM TEMPLATE. DO NOT EDIT IT DIRECTLY";
export const PLATFORMS = {
  "next": ['next', 'react-like'],
  "js": ['js'],
  "template": ['template', 'react-like', 'next', 'js']
}


export function processMacros(content: string, platforms: string[]): string {
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
   * Parse platform tokens from a directive substring (the part after IF_PLATFORM, ELSE_IF_PLATFORM, etc.).
   * We do a basic split on whitespace, then remove punctuation except for letters/numbers/hyphens.
   */
  function parsePlatformList(platform: string): string[] {
    return platform
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
   *   "blah blah IF_PLATFORM platform1 platform2 ???"  => captures "platform platform2 ???"
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
        const platformList = parsePlatformList(beginMatch[1]); // e.g. "platform1 platform2 ???"
        const matched = platformList.some((e) => platforms.includes(e));
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
          // If not, we check if the platform matches
          if (block.hasMatched) {
            block.isActive = false;
          } else {
            const platformList = parsePlatformList(elseIfMatch[1]);
            const matched = platformList.some((e) => platforms.includes(e));
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
      const platformList = parsePlatformList(nextLineMatch[1]);
      const matched = platformList.some((e) => platforms.includes(e));
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

/**
 * Recursively remove empty folders in the given directory.
 */
function removeEmptyFolders(dir: string) {
  if (!fs.existsSync(dir)) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let isEmpty = true;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively remove empty subdirectories
      removeEmptyFolders(fullPath);

      // Check if the folder is now empty
      if (fs.existsSync(fullPath) && fs.readdirSync(fullPath).length === 0) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        isEmpty = false;
      }
    } else {
      // Directory contains at least one file
      isEmpty = false;
    }
  }

  // Remove the directory if it is empty
  if (isEmpty) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Remove any files/directories in destDir that do not exist in srcDir.
 *
 * This function also accounts for the package-template.json -> package.json rename.
 */
function removeExtraneousDestItems(srcDir: string, destDir: string, ignorePaths: string[], baseDir: string) {
  if (!fs.existsSync(destDir)) return;

  const destEntries = fs.readdirSync(destDir, { withFileTypes: true });

  for (const entry of destEntries) {
    const destPath = path.join(destDir, entry.name);

    if (ignorePaths.includes(entry.name)) continue;

    let correspondingSrc = path.join(srcDir, entry.name);

    if (!fs.existsSync(correspondingSrc)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      removeExtraneousDestItems(correspondingSrc, destPath, ignorePaths, baseDir);
    }
  }
}

export function copyFromSrcToDest(options: {
  srcDir: string;
  destDir: string;
  editFn?: (relativePath: string, content: string) => string;
  filterFn?: (relativePath: string) => boolean;
  destFn?: (relativePath: string) => string;
  baseDir: string;
  topLevel?: boolean;
  destNotRemovePaths?: string[];
}) {
  // Use srcDir as the default base directory so that relative paths are computed from the source root.
  const { 
    srcDir, 
    destDir, 
    editFn, 
    filterFn, 
    destFn, 
    baseDir,
    topLevel = true, 
    destNotRemovePaths = [] 
  } = options;

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relativePath = path.relative(baseDir, srcPath);

    // Skip entry if filterFn returns false
    if (filterFn && !filterFn(relativePath)) {
      continue;
    }

    const destRelativePath = destFn ? destFn(relativePath) : relativePath;
    const destPath = path.join(destDir, destRelativePath);
    const destParent = path.dirname(destPath);

    if (entry.isDirectory()) {
      // Optionally apply destFn to directories as well if provided.
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }

      copyFromSrcToDest({
        srcDir: srcPath,
        destDir: destDir,
        editFn,
        filterFn,
        destFn,
        baseDir,
        topLevel: false,
        destNotRemovePaths
      });
    } else {
      // Read file as a buffer so we can check if it’s binary.
      const buffer = fs.readFileSync(srcPath);
      const isBinary = buffer.includes(0);

      if (!fs.existsSync(destParent)) {
        fs.mkdirSync(destParent, { recursive: true });
      }

      if (isBinary) {
        fs.writeFileSync(destPath, buffer);
      } else {
        // For text files, allow modification via editFn.
        const content = buffer.toString('utf-8');
        const result = editFn ? editFn(relativePath, content) : content;
        writeFileSyncIfChanged(destPath, result);
      }
    }
  }

  // removeExtraneousDestItems(srcDir, destDir, destNotRemovePaths, baseDir);

  // if (topLevel) {
  //   removeEmptyFolders(destDir);
  // }
}
