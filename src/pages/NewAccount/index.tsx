import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import FormItemInput from "@/components/FormItemInput";
import callAPI from "@/services/api";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import LandingPage from "@/layouts/LandingPage";
import ErrorMessage from "@/components/ErrorMessage";
import useError from "@/hooks/useError";

type Account = {
  name: string;
  email: string;
  password: string;
};

export default function NewAccount() {
  const [loadingAccount, setLoadingAccount] = useState<boolean>(false);
  const [account, setAccount] = useState<Account>({
    name: "",
    email: "",
    password: "",
  });

  const { error, setError } = useError();
  const { push } = useRouter();

  function handleOnChangeInput(inputEvent: ChangeEvent<HTMLInputElement>) {
    const { name, value } = inputEvent.target;
    setAccount({ ...account, [name]: value });
  }

  function handleGoToLogin() {
    push("/login");
  }

  async function handleFormSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    setLoadingAccount(true);
    
    try {
      const response = await callAPI({
        method: "POST",
        url: "/users",
        data: account,
      });
      
      if (response.success) {
        setError({ hasError: false });
        handleGoToLogin();
      } else {
        setError({ 
          hasError: true, 
          message: response.message 
        });
      }
    } catch (err) {
      setError({
        hasError: true,
        message: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoadingAccount(false);
    }
  }

  return (
    <LandingPage title="">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col w-full max-w-md gap-4 p-8 bg-[#141415] shadow-sm text-white"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Registrar-se</h1>

        <FormItemInput
          label="Nome"
          inputEvent={{
            required: true,
            name: "name",
            type: "text",
            value: account.name,
            onChange: handleOnChangeInput,
            className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
            placeholder: "Seu nome completo",
            autoFocus: true
          }}
        />

        <FormItemInput
          label="Email"
          inputEvent={{
            required: true,
            name: "email",
            type: "email",
            value: account.email,
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
            value: account.password,
            onChange: handleOnChangeInput,
            className: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
            placeholder: "••••••••"
          }}
        />

        <ErrorMessage {...error} />

        <ButtonWithLoading
          type="submit"
          isLoading={loadingAccount}
          className="w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
        >
          Criar conta
        </ButtonWithLoading>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={handleGoToLogin}
              className="text-white font-medium hover:underline"
            >
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </LandingPage>
  );
}