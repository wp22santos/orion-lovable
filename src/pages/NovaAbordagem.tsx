import { AbordagemHeader } from "@/components/AbordagemHeader";
import { AbordagemForm } from "@/components/AbordagemForm";

const NovaAbordagem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/50">
      <AbordagemHeader />
      <div className="pt-20 pb-24">
        <AbordagemForm />
      </div>
    </div>
  );
};

export default NovaAbordagem;