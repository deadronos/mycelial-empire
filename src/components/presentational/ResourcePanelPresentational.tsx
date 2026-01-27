import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormattedResource {
  key: string;
  formattedValue: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface ResourcePanelPresentationalProps {
  resources: FormattedResource[];
  pulseDisplay: string;
}

export const ResourcePanelPresentational = ({ resources, pulseDisplay }: ResourcePanelPresentationalProps) => (
  <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
    <CardHeader className="py-3 px-4 flex flex-row items-center gap-2 space-y-0">
      <Activity className="h-4 w-4 text-purple-300" />
      <CardTitle className="text-[10px] uppercase tracking-[0.2em] text-purple-200/80">
        Resources
      </CardTitle>
    </CardHeader>
    <CardContent className="px-3 pb-3">
      <div className="grid grid-cols-2 gap-2">
        {resources.map(({ key, formattedValue, icon, label, color }) => (
          <div
            key={key}
            className="border border-white/5 rounded-lg px-2 py-1.5 bg-black/20 flex flex-col gap-0.5 shadow-sm"
          >
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
              {icon}
              <span className="uppercase tracking-wider">{label}</span>
            </div>
            <p className={`text-base font-semibold ${color}`}>
              {formattedValue}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-slate-400 italic">
        Pulse: +{pulseDisplay} flow/s
      </div>
    </CardContent>
  </Card>
);