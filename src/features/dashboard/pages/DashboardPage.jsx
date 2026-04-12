// Lottie
import Lottie from "lottie-react";

// Router
import { Link } from "react-router-dom";

// Hooks
import useModal from "@/shared/hooks/useModal";

// Tanstack Query
import { useQuery } from "@tanstack/react-query";

// Icons
import { ChevronRight, Download } from "lucide-react";

// API
import { authAPI } from "@/features/auth/api/auth.api";

// Components
import Card from "@/shared/components/ui/Card";
import HolidayInfo from "../components/HolidayInfo";
import Button from "@/shared/components/ui/button/Button";
import DownloadAppModal from "../components/DownloadAppModal";

// Utils
import { getTimedRandomAnimation } from "@/shared/utils/animations.utils";

const Dashboard = () => {
  const { openModal } = useModal();

  const { data: user } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authAPI.getMe().then((res) => res.data.data),
  });

  const { animation } = getTimedRandomAnimation({
    family: "duck",
    sentiment: ["positive", "playful"],
  });

  return (
    <div>
      {/* Top Bar */}
      <div className="flex gap-4 mb-4">
        {/* Greetings */}
        <Card className="flex items-center gap-3.5 !py-3 grow xs:gap-4">
          <Lottie
            animationData={animation}
            className="hidden size-7 sm:inline-block"
          />

          <h2 className="font-medium line-clamp-1 text-xs xs:font-semibold xs:text-base sm:page-title">
            Xush kelibsiz, {user?.fullName}!
          </h2>
        </Card>

        {/* Download button */}
        <button
          onClick={() => openModal("downloadApp")}
          className="flex items-center gap-4 shrink-0 w-10 h-auto bg-blue-100 text-blue-500 rounded-xl overflow-hidden font-medium text-sm xs:w-12 md:w-auto lg:aspect-auto lg:pl-4"
        >
          <span className="hidden lg:inline">Ilovani yuklab olish</span>
          <span className="flex items-center justify-center w-full bg-blue-500 text-white h-full sm:w-auto sm:px-4">
            <Download className="size-5" strokeWidth={1.5} />
          </span>
        </button>
      </div>

      {/* Holiday Info */}
      <HolidayInfo />

      {/* My Penalties */}
      <Button to="/penalties/my" asChild>
        <Link to="/penalties/my">
          Mening jarimalarim
          <ChevronRight />
        </Link>
      </Button>

      {/* Download App Modal */}
      <DownloadAppModal />
    </div>
  );
};

export default Dashboard;
