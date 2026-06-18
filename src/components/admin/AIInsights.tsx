import { useState } from "react";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface AIInsightsProps {
  orders: any[];
  products: any[];
  profiles: any[];
}

export const AIInsights = ({ orders, products, profiles }: AIInsightsProps) => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState("");

  const generateInsights = async () => {
    setLoading(true);
    try {
      const totalRevenue = orders.reduce((s: number, o: any) => s + (o.total || 0), 0);
      const avgOrder = orders.length ? totalRevenue / orders.length : 0;
      const topProducts = products.sort((a: any, b: any) => (b.review_count || 0) - (a.review_count || 0)).slice(0, 5).map((p: any) => p.name);
      const lowStock = products.filter((p: any) => (p.stock || 0) < 20).length;
      const statusBreakdown = orders.reduce((acc: Record<string, number>, o: any) => {
        acc[o.status || "unknown"] = (acc[o.status || "unknown"] || 0) + 1;
        return acc;
      }, {});

      const context = `Platform Data Summary:
- Total Orders: ${orders.length}
- Total Revenue: ¥${totalRevenue.toLocaleString()}
- Average Order Value: ¥${Math.round(avgOrder).toLocaleString()}
- Total Products: ${products.length}
- Low Stock Items (<20): ${lowStock}
- Total Users: ${profiles.length}
- Order Status: ${JSON.stringify(statusBreakdown)}
- Top Products by Reviews: ${topProducts.join(", ")}`;

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          message: "Analyze this e-commerce platform data and provide 5 key actionable insights for the admin team. Focus on revenue optimization, inventory management, and customer engagement strategies for the Japanese market.",
          context,
          mode: "admin-insights",
        },
      });
      if (error) throw error;
      setInsights(data.reply);
    } catch {
      setInsights("Unable to generate insights at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-[var(--card-shadow)] animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg">AI Business Insights</h3>
        </div>
        <Button
          onClick={generateInsights}
          disabled={loading}
          size="sm"
          className="gap-1.5"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {loading ? "Analyzing..." : insights ? "Refresh" : "Generate Insights"}
        </Button>
      </div>

      {!insights && !loading && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          Click "Generate Insights" to get AI-powered analysis of your platform data.
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Analyzing platform data...</p>
          </div>
        </div>
      )}

      {insights && !loading && (
        <div className="prose prose-sm max-w-none text-foreground">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{insights}</div>
        </div>
      )}
    </div>
  );
};
