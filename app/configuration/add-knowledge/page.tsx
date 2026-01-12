"use client";

import { useState } from "react";
import { Upload, Pencil, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfigureLayout } from "@/components/ui/configure-layout";
import axios from "axios";



export default function AddKnowledgePage() {
  return (
    <ConfigureLayout
      title="Add Knowledge"
      description="Upload files to train your AI agent"
    >
    <div></div>
    </ConfigureLayout>
  );
}
