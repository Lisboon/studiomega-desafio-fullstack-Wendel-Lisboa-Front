import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormItemInput from "@/components/FormItemInput";
import callAPI from "@/services/api";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import LandingPage from "@/layouts/LandingPage";
import { useAuthentication } from "@/contexts/AuthenticationManager/Provider";
import { createOnStorage } from "@/utils/storage";
import { AUTHENTICATION_TOKEN_KEY } from "@/constants/storage";
import ErrorMessage from "@/components/ErrorMessage";
import useError from "@/hooks/useError";

type Credentials = {
  email: string;
  password: string;
};

export default function Login() {
  const [loadingCredentials, setLoadingCredentials] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({
    email: "",
    password: "",
  });

  const { error, setError } = useError();
  const { push } = useRouter();
  const { setUser } = useAuthentication();

  function handleOnChangeInput(inputEvent: ChangeEvent<HTMLInputElement>) {
    const { name, value } = inputEvent.target;
    setCredentials({ ...credentials, [name]: value });
  }

  function handleGoToNewAccount() {
    push("/account");
  }

  function handleGoToLeads() {
    push("/leads");
  }

  async function handleFormSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    setLoadingCredentials(true);
    
    try {
      const response = await callAPI({
        method: "POST",
        url: "/users/auth",
        data: credentials,
      });

      if (response.success) {
        const token = response?.data?.token as string;
        createOnStorage(AUTHENTICATION_TOKEN_KEY, token);
        handleGoToLeads();
        setError({ hasError: false });
        setUser({
          name: response.data?.user?.name as string,
          email: response.data?.user?.email as string,
        });
      } else {
        setError({
          hasError: true,
          message: response.message as string,
        });
      }
    } catch (err) {
      setError({
        hasError: true,
        message: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoadingCredentials(false);
    }
  }

  return (
    <LandingPage title="">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col w-full max-w-md gap-4 p-8 bg-[#141415] shadow-sm text-white"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Conectar-se</h1>

        <FormItemInput
          label="Email"
          inputEvent={{
            autoFocus: true,
            required: true,
            name: "email",
            type: "email",
            value: credentials.email,
            onChange: handleOnChangeInput,
            className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
            placeholder: "Seu e-mail"
          }}
        />

        <FormItemInput
          label="Senha"
          inputEvent={{
            required: true,
            name: "password",
            type: "password",
            value: credentials.password,
            onChange: handleOnChangeInput,
            className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
            placeholder: "••••••••"
          }}
        />

        <ErrorMessage {...error} />

        <ButtonWithLoading
          type="submit"
          isLoading={loadingCredentials}
          className="w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          Continuar
        </ButtonWithLoading>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Não tem uma conta?{" "}
            <a
              href="/account"
              className="text-white font-medium hover:underline"
            >
              Registrar-se
            </a>
          </p>
        </div>
      </form>
    </LandingPage>
  );
}