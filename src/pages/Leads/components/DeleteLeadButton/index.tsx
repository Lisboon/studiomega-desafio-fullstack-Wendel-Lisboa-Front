import { Dispatch, SetStateAction, useState } from "react";
import callAPI from "@/services/api";
import { Leads } from "@/types";
import ButtonWithLoading from "@/components/ButtonWithLoading";

type Props = {
  lead: Leads;
  setLeads: Dispatch<SetStateAction<Leads[]>>;
};

export default function DeleteLeadButton({ lead, setLeads }: Props) {
  const [loadingDeleteLead, setLoadingDeleteLead] = useState<boolean>(false);

  const deleteLead = async () => {
    if (!confirm('Tem certeza que deseja deletar este lead?')) return;
    
    setLoadingDeleteLead(true);
    try {
      const response = await callAPI({
        method: "DELETE",
        url: `leads/${lead.id}`,
      });
      
      if (response.success) {
        setLeads((currentLeads) => 
          currentLeads.filter((leadItem) => leadItem.id !== lead.id)
        );
      }
    } finally {
      setLoadingDeleteLead(false);
    }
  };

  return (
    <ButtonWithLoading
      isLoading={loadingDeleteLead}
      className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      onClick={deleteLead}
    >
      Deletar
    </ButtonWithLoading>
  );
}