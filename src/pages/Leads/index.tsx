import { Fragment, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LandingPage from "@/layouts/LandingPage";
import callAPI from "@/services/api";
import { Leads } from "@/types";
import Spinner from "@/components/Spinner";
import { deleteFromStorage } from "@/utils/storage";
import { AUTHENTICATION_TOKEN_KEY } from "@/constants/storage";
import EditLeadButton from "./components/EditLeadButton";
import DeleteLeadButton from "./components/DeleteLeadButton";

export default function LeadsPage() {
  const [loadingLeads, setLoadingLeads] = useState<boolean>(true);
  const [leads, setLeads] = useState<Leads[]>([]);

  const { push } = useRouter();

  const goToNewLead = () => {
    push("/leads/create");
  };

  const goBackToLogin = useCallback(() => {
    deleteFromStorage(AUTHENTICATION_TOKEN_KEY);
    push("/");
  }, [push]);

  const loadLeads = useCallback(async () => {
    setLoadingLeads(true);
    const response = await callAPI({ method: "GET", url: "/leads" });
    if (response.success) {
      setLeads((response?.data as Leads[]) || []);
    } else {
      goBackToLogin();
    }
    setLoadingLeads(false);
  }, [goBackToLogin]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  return (
    <LandingPage title="">
      <div className="p-8 flex flex-col gap-8 w-full max-w-6xl mx-auto bg-[#141415]">
        <button 
          onClick={goToNewLead}
          className="w-full py-3 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
        >
          Cadastrar novo Lead
        </button>

        {loadingLeads ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <Fragment>
            {leads.length > 0 ? (
              <div className="overflow-x-auto w-full b">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#141415]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Telefone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#141415] divide-y divide-gray-700">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-[#1E1E1F]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {lead.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {lead.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {lead.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end items-center gap-2">
                            <EditLeadButton lead={lead} />
                            <DeleteLeadButton lead={lead} setLeads={setLeads} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-white">
                Não existe nenhum lead cadastrado
              </p>
            )}
          </Fragment>
        )}
      </div>
    </LandingPage>
  );
}