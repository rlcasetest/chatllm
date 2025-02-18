import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@/components/forms/error-message";
import { useRegister } from "@/hooks/auth/useRegister";

const schema = z
  .object({
    email: z.string().email("Not a valid email"),
    password: z.string().min(6, "Should be at least 6 characters"),
    confirmPassword: z.string().min(1, "Should be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type Schema = z.output<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutateAsync } = useRegister();
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await mutateAsync(data);
    navigate("/chat");
  };
  const { handleSubmit, register, getFieldState } = useForm({
    mode: "all",
    resolver: zodResolver(schema),
    shouldFocusError: true,
    shouldUseNativeValidation: true,
  });

  return (
    <form
      className="flex justify-center items-center h-dvh w-dvw"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="min-w-[30vw] rounded-xl">
        <CardHeader></CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email", { required: true })} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            <ErrorMessage
              errorMessage={getFieldState("confirmPassword").error?.message}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <Button className="font-bold px-36 rounded-full" type="submit">
            Register
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
