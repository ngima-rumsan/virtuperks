"use client";

import { useParticipantLookup } from "@/hooks/client/participant.lookup";
import { useAssignRole, useRevokeRole } from "@/hooks/subgraph/role.user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useToast } from "@workspace/ui/hooks/use-toast";
import { ArrowLeft, UserPlus, UserX } from "lucide-react";
import { useSearchParams } from "next/dist/client/components/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AssignRoleForm, assignRoleSchema } from "./schema";

const defaultValues: AssignRoleForm = {
  walletAddress: "",
  role: "",
};

type Props = {
  router: AppRouterInstance;
};

export default function AssignRoleFormPage({ router }: Props) {
  const form = useForm<AssignRoleForm>({
    resolver: zodResolver(assignRoleSchema),
    defaultValues,
  });

  const { toast } = useToast();
  const { assignRole, assignRolePending } = useAssignRole();
  const { revokeRole, revokeRolePending } = useRevokeRole();

  const { data: lookupData = {} } = useParticipantLookup();
const participants = lookupData?.data || [];

const [query, setQuery] = useState("");
const [open, setOpen] = useState(false);

const filtered = participants.filter((p: any) =>
  p.name.toLowerCase().includes(query.toLowerCase()) ||
  p.address.toLowerCase().includes(query.toLowerCase())
);



  const searchParams = useSearchParams();
  const action = searchParams.get("action") as "assign" | "revoke" | null;

  const showAssign = action === "assign";
  const showRevoke = action === "revoke";

  const handleSubmit = async (data: AssignRoleForm, action: "assign" | "revoke") => {
    try {
      const roleHex = data.role as `0x${string}`;
      const appId = process.env.NEXT_PUBLIC_APP_ID as `0x${string}`;
      let result;

      if (action === "assign") {
        result = await assignRole({
          role: roleHex,
          appId,
          wallet: data.walletAddress as `0x${string}`,
        });
        toast({
          title: "Role Assigned",
          description: `Role assigned successfully. TX Hash: ${result.txHash}`,
        });
      } else {
        result = await revokeRole({
          role: roleHex,
          appId,
          wallet: data.walletAddress as `0x${string}`,
        });
        toast({
          title: "Role Revoked",
          description: `Role revoked successfully. TX Hash: ${result.txHash}`,
        });
      }

      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Transaction Failed",
        description: error?.message || `Unable to ${action} role`,
      });
    }
  };

  const isLoading = assignRolePending || revokeRolePending;

  return (
    <div className="w-full items-center">
      <main className="gap-2 p-4 sm:px-8 md:gap-8 w-full">
        {/* Header */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-400"
        >
          <ArrowLeft size={24} strokeWidth={2} />
          <span className="font-base text-gray-700">Back</span>
        </div>

        <div className="flex flex-col gap-1 my-2">
          <h1 className="font-bold text-4xl">Manage Role</h1>
          <h3 className="text-gray-500 font-normal text-sm">
            {showAssign ? "Assign a role to a wallet address" : "Revoke a role from a wallet address"}
          </h3>
        </div>

        {/* Form Card */}
        <Card className="rounded-lg w-full my-6">
          <CardContent className="p-0">
            <Form {...form}>
              <form>
                <div className="p-6 space-y-6">
                <FormField
  control={form.control}
  name="walletAddress"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Wallet Address</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            placeholder="Search by name or address"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              field.onChange(""); // clear stored wallet
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
          />

{open && filtered.length > 0 && (
  <div
    className="absolute w-full bg-white border rounded-md shadow-md z-20 
               max-h-48 overflow-y-auto"
  >
    {filtered.map((p: any) => (
      <div
        key={p.address}
        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
        onMouseDown={() => {
          setQuery(p.name);
          field.onChange(p.address);
          setOpen(false);
        }}
      >
        <div className="font-medium">{p.name}</div>
        <div className="text-xs text-gray-500">
          {p.address.slice(0, 10)}...{p.address.slice(-6)}
        </div>
      </div>
    ))}
  </div>
)}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

                  {/* Role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={process.env.NEXT_PUBLIC_MINTER_ROLE as string}>
                              Minter
                            </SelectItem>
                            <SelectItem value={process.env.NEXT_PUBLIC_PARTICIPANT_ROLE as string}>
                              Participant
                            </SelectItem>
                            <SelectItem value={process.env.NEXT_PUBLIC_DEFAULT_ADMIN_ROLE as string}>
                              Admin
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
                  <div className="w-full flex justify-end gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-[170px]"
                      onClick={() => history.back()}
                    >
                      Cancel
                    </Button>

                    {showAssign && (
                      <Button
                        type="button"
                        variant="default"
                        className="w-[170px]"
                        disabled={isLoading}
                        onClick={() => form.handleSubmit((data) => handleSubmit(data, "assign"))()}
                      >
                        <UserPlus size={25} strokeWidth={2} /> 
                        {assignRolePending ? "Assigning..." : "Assign Role"}
                      </Button>
                    )}

                    {showRevoke && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-[170px]"
                        disabled={isLoading}
                        onClick={() => form.handleSubmit((data) => handleSubmit(data, "revoke"))()}
                      >  
                        <UserX size={25} strokeWidth={2} />
                        {revokeRolePending ? "Revoking..." : "Revoke Role"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
