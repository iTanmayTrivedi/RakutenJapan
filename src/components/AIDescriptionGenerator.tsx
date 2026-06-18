import { useState } from "react";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AIDescriptionGeneratorProps {
  productName: string;
  category: string;
  price: string;
  onUseDescription: (desc: string) => void;
}

export const AIDescriptionGenerator = ({ productName, category, price, onUseDescription }: AIDescriptionGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    if (!productName) {
      toast({ title: "Enter a product name first", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: {
          message: `Write a product description for: "${productName}" in the ${category || "General"} category, priced at ¥${price || "N/A"}.`,
          mode: "seller-description",
        },
      });
      if (error) throw error;
      setGenerated(data.reply);
    } catch {
      toast({ title: "Failed to generate description", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={generate}
        disabled={loading}
        className="gap-1.5 text-xs"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-secondary" />}
        {loading ? "Generating..." : "AI Generate Description"}
      </Button>
      {generated && (
        <div className="bg-accent/50 rounded-lg p-3 text-sm space-y-2 animate-fade-in">
          <p className="text-foreground leading-relaxed">{generated}</p>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" className="text-xs gap-1" onClick={handleCopy}>
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button type="button" size="sm" className="text-xs gap-1" onClick={() => onUseDescription(generated)}>
              <Sparkles className="h-3 w-3" /> Use This
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
