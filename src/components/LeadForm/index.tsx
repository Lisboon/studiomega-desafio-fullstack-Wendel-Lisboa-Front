import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FormItemInput from "@/components/FormItemInput";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import { Leads } from "@/types";
import FormItemTextarea from "@/components/FormItemTextarea";

const initialLead = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

type Props = {
  defaultLead?: Leads;
  submiteButtonText: string;
  onSubmit: (lead: Leads) => Promise<void>;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  buttonClassName?: string;
  textareaClassName?: string;
};

export default function LeadForm({
  defaultLead,
  submiteButtonText,
  onSubmit,
  className = "flex flex-col gap-4",
  inputClassName = "w-full p-3 bg-[#1E1E1F] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400",
  labelClassName = "block text-sm font-medium text-white mb-1",
  buttonClassName = "w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors",
  textareaClassName = "w-full p-3 bg-[#1E1E1F] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 min-h-[100px]"
}: Props) {
  const [loadingSubmiteLead, setLoadingSubmiteLead] = useState<boolean>(false);
  const [lead, setLead] = useState<Leads>(defaultLead || initialLead);

  const { push } = useRouter();

  function handleOnChangeInput(inputEvent: ChangeEvent<HTMLInputElement>) {
    const { name, value } = inputEvent.target;
    setLead({ ...lead, [name]: value });
  }

  function handleOnChangeTextarea(textareaEvent: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = textareaEvent.target;
    setLead({ ...lead, [name]: value });
  }

  function handleGoToLeads() {
    push("/leads");
  }

  async function handleFormSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    setLoadingSubmiteLead(true);
    await onSubmit(lead);
    setLoadingSubmiteLead(false);
  }

  return (
    <form onSubmit={handleFormSubmit} className={className}>
      <FormItemInput
        label="Nome"
        labelClassName={labelClassName}
        inputEvent={{
          required: true,
          name: "name",
          type: "text",
          value: lead.name,
          onChange: handleOnChangeInput,
          className: inputClassName,
          placeholder: "Nome completo"
        }}
      />

      <FormItemInput
        label="Email"
        labelClassName={labelClassName}
        inputEvent={{
          required: true,
          name: "email",
          type: "email",
          value: lead.email,
          onChange: handleOnChangeInput,
          className: inputClassName,
          placeholder: "exemplo@email.com"
        }}
      />

      <FormItemInput
        label="Telefone"
        labelClassName={labelClassName}
        inputEvent={{
          required: true,
          name: "phone",
          type: "tel",
          value: lead.phone,
          onChange: handleOnChangeInput,
          className: inputClassName,
          placeholder: "(00) 00000-0000"
        }}
      />

      <FormItemTextarea
        label="Mensagem"
        labelClassName={labelClassName}
        textareaEvent={{
          required: true,
          name: "message",
          value: lead.message,
          onChange: handleOnChangeTextarea,
          className: textareaClassName,
          placeholder: "Digite sua mensagem..."
        }}
      />

      <ButtonWithLoading
        type="submit"
        isLoading={loadingSubmiteLead}
        className={buttonClassName}
      >
        {submiteButtonText}
      </ButtonWithLoading>

      <button
        type="button"
        className="w-full py-3 bg-transparent border border-gray-700 text-white rounded-md font-medium hover:bg-red-500 transition-colors"
        onClick={handleGoToLeads}
      >
        Voltar a listagem
      </button>
    </form>
  );
}