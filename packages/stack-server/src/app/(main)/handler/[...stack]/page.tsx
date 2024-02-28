import { StackHandler } from "stack";
import { stackServerApp } from "@/stack";

export default function Handler(props: any) {
  return <StackHandler {...props} app={stackServerApp} />;
}