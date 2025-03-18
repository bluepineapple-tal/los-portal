import { AlertCircle } from "lucide-react";
import React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  title: string;
  description: string;
};

const AlertDestructive = ({ title, description }: Props) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default AlertDestructive;
