/**
 * [INPUT]: @/components/ui/card, @/components/RadarChart, @/components/RadarDetailCard, @/components/MetricDetailCard
 * [OUTPUT]: DetailedReport component
 * [POS]: components/DetailedReport - Paid tier detailed analysis report
 * [PROTOCOL]: Update this header on changes, then check AGENTS.md
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadarChart } from '@/components/RadarChart';
import { RadarDetailCard } from '@/components/RadarDetailCard';
import { MetricDetailCard } from '@/components/MetricDetailCard';
import { cn } from '@/lib/utils';

function ConcernCard({ concerns }) {
  if (!concerns?.length) return null;

  return (
    <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
      <h3 className="font-medium text-amber-800 mb-3 flex items-center gap-2 text-sm">
        <span>⚠️</span> 需要关注
      </h3>
      <div className="flex flex-wrap gap-2">
        {concerns.map((concern, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="bg-amber-100 text-amber-700 border-0 font-normal text-xs"
          >
            {concern}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function DetailedReport({ result }) {
  if (!result) return null;

  const { radar, radar_detail, metrics_detail, concerns, gender } = result;

  return (
    <Card className="w-full max-w-[340px] mx-auto border-0 shadow-lg shadow-stone-200/50 bg-white/80 backdrop-blur-sm overflow-hidden animate-in zoom-in-95 duration-300">
      <CardHeader className="border-b border-stone-100/50 bg-white/50 py-4">
        <CardTitle className="text-base font-medium text-center text-stone-800">
          详细分析报告
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-stone-100/50 p-1 mb-4 rounded-full h-9">
            <TabsTrigger
              value="radar"
              className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm"
            >
              气质雷达
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="rounded-full text-xs data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm"
            >
              肤质分析
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="pt-0 space-y-4">
            <div className="flex justify-center py-2">
              <RadarChart data={radar} />
            </div>
            
            <div className="space-y-3">
              <RadarDetailCard radarKey="youthfulness" data={radar_detail?.youthfulness} gender={gender} />
              <RadarDetailCard radarKey="elegance" data={radar_detail?.elegance} gender={gender} />
              <RadarDetailCard radarKey="vibe" data={radar_detail?.vibe} gender={gender} />
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="pt-0">
            <div className="space-y-3">
              <MetricDetailCard metricKey="skin_quality" data={metrics_detail?.skin_quality} />
              <MetricDetailCard metricKey="anti_aging" data={metrics_detail?.anti_aging} />
              <MetricDetailCard metricKey="vitality" data={metrics_detail?.vitality} />
            </div>
          </TabsContent>
        </Tabs>

        <ConcernCard concerns={concerns} />
      </CardContent>
    </Card>
  );
}

export default DetailedReport;
