
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  aiHint: string;
}

const invoiceTemplates: TemplateOption[] = [
  { id: 'inv-modern', name: 'Modern Invoice', description: 'A sleek and contemporary invoice design.', imageUrl: 'https://picsum.photos/300/400?invoice=modern', aiHint: 'invoice modern' },
  { id: 'inv-classic', name: 'Classic Invoice', description: 'A traditional and formal invoice layout.', imageUrl: 'https://picsum.photos/300/400?invoice=classic', aiHint: 'invoice classic' },
  { id: 'inv-simple', name: 'Simple Invoice', description: 'A minimalist and clean invoice format.', imageUrl: 'https://picsum.photos/300/400?invoice=simple', aiHint: 'invoice simple' },
];

const quotationTemplates: TemplateOption[] = [
  { id: 'qt-professional', name: 'Professional Quotation', description: 'A detailed and formal quotation style.', imageUrl: 'https://picsum.photos/300/400?quotation=professional', aiHint: 'quotation professional' },
  { id: 'qt-creative', name: 'Creative Quotation', description: 'A visually appealing quotation for creative services.', imageUrl: 'https://picsum.photos/300/400?quotation=creative', aiHint: 'quotation creative' },
  { id: 'qt-standard', name: 'Standard Quotation', description: 'A straightforward and clear quotation format.', imageUrl: 'https://picsum.photos/300/400?quotation=standard', aiHint: 'quotation standard' },
];

export default function TemplatesSettingsPage() {
  const { toast } = useToast();
  const [selectedInvoiceTemplate, setSelectedInvoiceTemplate] = useState<string | null>('inv-modern');
  const [selectedQuotationTemplate, setSelectedQuotationTemplate] = useState<string | null>('qt-professional');

  const handleSelectInvoiceTemplate = (templateId: string) => {
    setSelectedInvoiceTemplate(templateId);
    // In a real app, save this preference (e.g., to localStorage or backend)
    toast({
      title: "Invoice Template Selected",
      description: `"${invoiceTemplates.find(t => t.id === templateId)?.name}" is now your default invoice template.`,
    });
  };

  const handleSelectQuotationTemplate = (templateId: string) => {
    setSelectedQuotationTemplate(templateId);
    // In a real app, save this preference
    toast({
      title: "Quotation Template Selected",
      description: `"${quotationTemplates.find(t => t.id === templateId)?.name}" is now your default quotation template.`,
    });
  };

  const TemplateCard = ({ template, onSelect, isSelected }: { template: TemplateOption, onSelect: (id: string) => void, isSelected: boolean }) => (
    <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-xl ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground p-1.5 rounded-full z-10">
          <CheckCircle className="h-5 w-5" />
        </div>
      )}
      <CardHeader className="p-0">
        <Image 
          src={template.imageUrl} 
          alt={template.name} 
          width={300} 
          height={400} 
          className="w-full h-48 object-cover" 
          data-ai-hint={template.aiHint}
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-1">{template.name}</CardTitle>
        <CardDescription className="text-xs mb-3 h-10">{template.description}</CardDescription>
        <Button 
          onClick={() => onSelect(template.id)} 
          className="w-full"
          variant={isSelected ? "default" : "outline"}
          disabled={isSelected}
        >
          {isSelected ? "Selected as Default" : "Set as Default"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Template Settings</h1>
          <p className="text-muted-foreground">Choose default templates for your invoices and quotations.</p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Invoice Templates</h2>
          <p className="text-muted-foreground mb-6">Select a default template for new invoices.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {invoiceTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onSelect={handleSelectInvoiceTemplate}
                isSelected={selectedInvoiceTemplate === template.id}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quotation Templates</h2>
          <p className="text-muted-foreground mb-6">Select a default template for new quotations.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {quotationTemplates.map(template => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onSelect={handleSelectQuotationTemplate}
                isSelected={selectedQuotationTemplate === template.id}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
