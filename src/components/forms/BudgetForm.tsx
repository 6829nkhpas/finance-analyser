"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { categories, formatCurrency, getCurrentMonth } from "@/lib/utils";
import { useFinanceStore } from "@/lib/store";
import { Target, Loader2 } from "lucide-react";

const budgetSchema = z.object({
  category: z.enum(["Food", "Rent", "Travel", "Shopping", "Bills", "Other"]),
  amount: z.number().positive("Amount must be positive"),
  month: z.string().min(1, "Month is required"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSuccess?: () => void;
}

export default function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const addBudget = useFinanceStore((state) => state.addBudget);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: "Food",
      month: getCurrentMonth(),
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newBudget = await response.json();
        addBudget(newBudget);
        reset();
        onSuccess?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      alert(error instanceof Error ? error.message : "Failed to create budget");
    } finally {
      setIsLoading(false);
    }
  };

  const amount = watch("amount");

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Set Budget
        </CardTitle>
        <CardDescription>
          Set monthly spending limits by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setValue("category", value as any)}
              defaultValue="Food"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            {amount && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(amount)}
              </p>
            )}
            {errors.amount && (
              <p className="text-sm text-destructive">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input id="month" type="month" {...register("month")} />
            {errors.month && (
              <p className="text-sm text-destructive">{errors.month.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting Budget...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4" />
                Set Budget
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
