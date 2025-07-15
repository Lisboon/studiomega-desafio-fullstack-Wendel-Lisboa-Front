import { useCallback } from "react";
import { useRouter } from "next/navigation";
import LandingPage from "@/layouts/LandingPage";
import { Leads } from "@/types";
import callAPI, { ResponseReturn } from "@/services/api";
import useError from "@/hooks/useError";
import LeadForm from "@/components/LeadForm";

export default function CreateLeadForm() {
  const { setError } = useError();
  const { push } = useRouter();

  const handleResponseReturn = useCallback(
    (response: ResponseReturn) => {
      if (response.success) {
        setError({ hasError: false });
        push("/leads");
      } else {
        setError({ hasError: true, message: response.message });
      }
    },
    [setError, push]
  );

  async function handleFormSubmit(lead: Leads) {
    const response = await callAPI({
      method: "POST",
      url: "/leads",
      data: lead,
    });
    handleResponseReturn(response);
  }

  return (
    <LandingPage title="">
      <div className="flex flex-col w-full max-w-md p-8 bg-[#141415] shadow-sm text-white mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">Cadastrar novo Lead</h1>
        <p className="text-center text-gray-400 mb-6">Preencha todos os campos abaixo</p>
        
        <LeadForm
          submiteButtonText="Criar informação de contato"
          onSubmit={(lead: Leads) => handleFormSubmit(lead)}
          className="space-y-4"
          inputClassName="w-full p-3 bg-[#1E1E1F] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400"
          labelClassName="block text-sm font-medium text-white"
          buttonClassName="w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
        />
      </div>
    </LandingPage>
  );
}