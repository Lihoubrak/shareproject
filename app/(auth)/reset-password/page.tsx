'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!newPassword) {
      setError("សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី។");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Update the user's password
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess("ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!");
      setTimeout(() => {
        router.push("/login"); // Redirect to login page after successful reset
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("មានកំហុសមិនបានរំពឹងទុកកើតឡើង។");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">កំណត់ពាក្យសម្ងាត់ឡើងវិញ</CardTitle>
          <CardDescription>សូមបញ្ចូលពាក្យសម្ងាត់ថ្មីរបស់អ្នក។</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="grid gap-2">
              <Label htmlFor="newPassword">ពាក្យសម្ងាត់ថ្មី</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <Button
              className="w-full"
              onClick={handlePasswordUpdate}
              disabled={loading}
            >
              {loading ? "កំពុងផ្លាស់ប្តូរ..." : "កំណត់ពាក្យសម្ងាត់ឡើងវិញ"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}