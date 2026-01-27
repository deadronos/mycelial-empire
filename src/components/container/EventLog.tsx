import { useGameStore } from "@/store/gameStore";
import { EventLogPresentational } from "../presentational/EventLogPresentational";

export const EventLog = () => {
  const { events } = useGameStore();

  return <EventLogPresentational events={events} />;
};
