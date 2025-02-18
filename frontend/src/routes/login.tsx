import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth/useLogin";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

type Inputs = {
  email: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const { mutateAsync } = useLogin();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await mutateAsync(data);
    navigate("/chat");
  };
  const { handleSubmit, register } = useForm<Inputs>();

  return (
    <form
      className="flex justify-center items-center h-dvh w-dvw"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="min-w-[30vw] rounded-xl">
        <CardHeader className="flex items-center pt-12 pb-8 cursor-default">
          <img src="/logo-white.png" className="h-32 w-32" />
        </CardHeader>

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
        </CardContent>

        <CardFooter className="flex flex-col items-center">
          <Button className="font-bold px-36 rounded-full" type="submit">
            Login
          </Button>

          <Button
            variant="link"
            className="font-bold px-0"
            onClick={() => navigate("/register")}
          >
            Don't have an account?
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
