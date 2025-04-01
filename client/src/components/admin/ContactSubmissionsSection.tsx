import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactSubmission } from "@shared/schema";

export function ContactSubmissionsSection() {
  const { t } = useTranslation();
  
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["/api/contact/submissions"],
    queryFn: async () => {
      try {
        return await apiRequest("/api/contact/submissions");
      } catch (error) {
        // API endpoint not implemented yet, return empty array
        console.log("Contact submissions API not implemented yet");
        return [];
      }
    }
  });
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>{t("admin.loading")}</p>
      </div>
    );
  }
  
  // Placeholder for future implementation
  if (submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <p>{t("admin.contact.noSubmissions")}</p>
        <p className="text-muted-foreground mt-2">{t("admin.contact.futureFeature")}</p>
      </div>
    );
  }
  
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.contact.name")}</TableHead>
            <TableHead>{t("admin.contact.email")}</TableHead>
            <TableHead>{t("admin.contact.date")}</TableHead>
            <TableHead>{t("admin.contact.subject")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission: ContactSubmission) => (
            <TableRow key={submission.id} className="cursor-pointer hover:bg-muted">
              <TableCell>{submission.name}</TableCell>
              <TableCell>{submission.email}</TableCell>
              <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
              <TableCell>{submission.subject}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Detailed view could be added in a future enhancement */}
    </div>
  );
}