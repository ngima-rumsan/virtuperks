import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

import { useToast } from "@workspace/ui/hooks/use-toast";
import { useState } from "react";

type DialogButtonProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  title: string;
  subTitle: string;
  buttonName: string;
  submitType: "Apply" | "complete";
  inputLabel?: string;
  inputPlaceholder?: string;
  handleApplyTaskLogic?: (data?: { completionUrl?: string }) => Promise<void>;
  isDisabled?: boolean;
};

export const DialogButton = ({
  isOpen,
  setIsOpen,
  title,
  subTitle,
  submitType,
  buttonName,
  inputLabel = "Completion URL",
  inputPlaceholder = "https://example.com/completion",
  handleApplyTaskLogic,
  isDisabled,
}: DialogButtonProps) => {
  const [completionUrl, setCompletionUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  console.log("dialogubox");

  const handleSubmit = async () => {
    setError(null);
    console.log(completionUrl, "completionUrl");

    if (submitType === "complete") {
      if (!completionUrl.trim()) {
        setError("Completion URL is required");
        toast({
          title: "Invalid Input",
          description: "Please enter a valid URL",
          variant: "destructive",
        });
        return;
      }
      try {
        await handleApplyTaskLogic?.({ completionUrl: completionUrl.trim() });
        setCompletionUrl("");
        setIsOpen(false);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to submit completion URL");
        toast({
          title: "Error",
          description: "Failed to mark task as complete",
          variant: "destructive",
        });
      }
    } else {
      try {
        await handleApplyTaskLogic?.();
        setIsOpen(false);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to apply for task",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setCompletionUrl("");
          setError(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {subTitle}
          </DialogDescription>
        </DialogHeader>
        {submitType === "complete" && (
          <div className="py-4">
            <Label
              htmlFor="completionUrl"
              className="block text-sm font-medium text-gray-700"
            >
              {inputLabel}
            </Label>
            <Input
              id="completionUrl"
              type="url"
              value={completionUrl}
              onChange={(e) => setCompletionUrl(e.target.value)}
              placeholder={inputPlaceholder}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${error ? "border-red-500" : ""}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDisabled}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={
              isDisabled || (submitType === "complete" && !completionUrl.trim())
            }
            className="bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-400 disabled:text-gray-200"
          >
            {isDisabled ? "Processing..." : buttonName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
