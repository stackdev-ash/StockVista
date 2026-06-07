import OnboardingModal from "./OnboardingModal";

interface Props {
  show: boolean;
  userId:string;
}

const OnboardingGate = ({ show, userId }: Props) => {
  if (!show) return null;

  return <OnboardingModal userId={userId} />;
};

export default OnboardingGate;