import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LandingPage from "@/layouts/LandingPage";
import { Leads } from "@/types";
import callAPI from "@/services/api";
import useError from "@/hooks/useError";
import LeadForm from "@/components/LeadForm";
import PageSpinner from "@/components/PageSpinner";

export default function UpdateLeadForm() {
  const [loadingLead, setLoadingLead] = useState<boolean>(true);

  const { setError } = useError();

  const { push } = useRouter();

  const searchParams = useSearchParams();
  const leadId = searchParams?.get("leadId");

  const handleGetLeadById = useCallback(async () => {
    setLoadingLead(true);
    const response = await callAPI({ method: "GET", url: `lead/${leadId}` });
    if (response.success) {
      setError({ hasError: false });
    } else {
      setError({ hasError: true, message: response.message });
    }
    setLoadingLead(false);
  }, [leadId, setError]);

  async function handleFormSubmit(lead: Leads) {
    const response = await callAPI({
      method: "PATCH",
      url: `/leads/${leadId}`,
      data: lead,
    });
    if (response.success) {
      setError({ hasError: false });
      push("/leads");
    } else {
      setError({ hasError: true, message: response.message });
    }
  }

  useEffect(() => {
    if (leadId) handleGetLeadById();
  }, [leadId, handleGetLeadById]);

  if (loadingLead) {
    return <PageSpinner />;
  }

  return (
    <LandingPage
      title=""
      description=""
    >
      <div className="bg-[#141415]">
        <LeadForm
          submiteButtonText="Atualizar informação de contato"
          onSubmit={(lead: Leads) => handleFormSubmit(lead)}
        />
      </div>
    </LandingPage>
  );
}