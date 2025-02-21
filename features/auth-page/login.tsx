"use client";
import { AI_NAME } from "@/features/theme/theme-config";
import { signIn } from "next-auth/react";
import { FC } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface LoginProps {
  isDevMode: boolean;
}

export const LogIn: FC<LoginProps> = (props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('bg.png')" }}>
      <Card className="flex gap-2 flex-col min-w-[300px] bg-white/90 p-4 rounded-md shadow-md">
        <CardHeader className="gap-2">
          <CardTitle className="text-2xl flex gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={"ai-icon.png"} />
            </Avatar>
            <span className="text-primary">{AI_NAME}</span>
          </CardTitle>
          <CardDescription>
            A new way to use AI Agents!
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => signIn("github")}>GitHub</Button>
          <Button onClick={() => signIn("azure-ad")}> Microsoft</Button>
          {props.isDevMode ? (
            <Button onClick={() => signIn("localdev")}>
              Basic Auth (DEV ONLY)
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
