"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { SearchResult } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, User, Fingerprint, MapPin, Download } from "lucide-react";

type ResultsTableProps = {
  results: SearchResult[];
};

export function ResultsTable({ results }: ResultsTableProps) {
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("PAKOSINT INTEL", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Pakistan Phone number and CNIC details lookup", 105, 28, { align: "center" });

    autoTable(doc, {
      startY: 40,
      head: [['Mobile', 'Name', 'CNIC', 'Address']],
      body: results.map(r => [r.mobile || "N/A", r.name || "N/A", r.cnic || "N/A", r.address || "N/A"]),
      theme: 'grid',
      headStyles: { fillColor: [34, 40, 49] }, // #222831
      styles: { font: 'Inter', halign: 'center' },
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
        doc.text("Data provided for informational purposes only.", 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save("PAKOSINT_INTEL_Results.pdf");
  };

  return (
    <Card className="shadow-2xl shadow-primary/10 border-border/50 bg-card/50 backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Search Results</CardTitle>
            <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
            </Button>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[150px]"><Smartphone className="inline-block mr-2 h-4 w-4" />Mobile</TableHead>
                        <TableHead><User className="inline-block mr-2 h-4 w-4" />Name</TableHead>
                        <TableHead><Fingerprint className="inline-block mr-2 h-4 w-4" />CNIC</TableHead>
                        <TableHead><MapPin className="inline-block mr-2 h-4 w-4" />Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((result, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{result.mobile || "N/A"}</TableCell>
                            <TableCell>{result.name || "N/A"}</TableCell>
                            <TableCell>{result.cnic || "N/A"}</TableCell>
                            <TableCell>
                                {result.address ? (
                                    <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        result.address
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                    >
                                    {result.address}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
  );
}
