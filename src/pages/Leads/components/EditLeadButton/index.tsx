import { useRouter } from "next/navigation";
import { Leads } from "@/types";

type Props = {
  lead: Leads;
};

export default function EditLeadButton({ lead }: Props) {
  const { push } = useRouter();

  const goToUpdatePage = async () => {
    const params = new URLSearchParams({
      leadId: lead.id as string,
    });
    push(`/leads/update?${params.toString()}`);
  };

  return (
    <button
      onClick={goToUpdatePage}
      className="px-4 py-2 bg-red-500 border border-gray-600 text-white rounded-md text-sm font-medium hover:bg-[#1E1E1F] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    >
      Editar
    </button>
  );
}