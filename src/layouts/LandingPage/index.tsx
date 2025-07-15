import { JSX, useState } from "react";
import { paragraphStyle } from "@/styledTags/Paragraph";
import { headingStyle } from "@/styledTags/Heading";
import ButtonWithLoading from "@/components/ButtonWithLoading";
import { AUTHENTICATION_TOKEN_KEY } from "@/constants/storage";
import { deleteFromStorage } from "@/utils/storage";
import { useAuthentication } from "@/contexts/AuthenticationManager/Provider";
import { buttonStyle } from "@/styledTags/Button";

type Props = {
  children: JSX.Element;
  title: string;
  description?: string;
};

export default function LandingPage({ children, title, description }: Props) {
  const [loadingLogout, setLoadingLogout] = useState<boolean>(false);
  const { user } = useAuthentication();

  async function handleLogout() {
    setLoadingLogout(true);
    deleteFromStorage(AUTHENTICATION_TOKEN_KEY);
    window.location.href = "/login";
    setLoadingLogout(false);
  }

  return (
    <main className="relative min-h-screen bg-[#141415]">
      {/* Botão Sair no canto superior direito - agora com z-index para garantir visibilidade */}
      {user !== null && (
        <div className="fixed top-4 right-4 z-50">
          <ButtonWithLoading
            isLoading={loadingLogout}
            className={buttonStyle({ 
              intent: "ghost",
              className: "text-white hover:text-red-500 border border-gray-600"
            })}
            onClick={handleLogout}
          >
            Sair do sistema
          </ButtonWithLoading>
        </div>
      )}

      {/* Conteúdo principal */}
      <div className="flex h-screen w-screen justify-center items-center pt-8">
        <div className="rounded-sm bg-white justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className={headingStyle()}>{title}</h1>
            {description && (
              <p className={paragraphStyle({ intent: "secondary" })}>
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}