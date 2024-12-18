import { AbordagemHeader } from "@/components/AbordagemHeader";
import { AbordagemForm } from "@/components/AbordagemForm";

const NovaAbordagem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <AbordagemHeader />
      <AbordagemForm />
    </div>
  );
};

export default NovaAbordagem;