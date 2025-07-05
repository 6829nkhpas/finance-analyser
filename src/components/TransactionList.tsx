"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore, Transaction } from "@/lib/store";
import {
  categories,
  categoryColors,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { Edit, Trash2, DollarSign, Calendar, Tag } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { updateTransaction, deleteTransaction } = useFinanceStore();

  const handleEdit = async (transaction: Transaction) => {
    setIsEditing(true);
    try {
      const response = await fetch(`/api/transactions/${transaction._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingTransaction),
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        updateTransaction(transaction._id, updatedTransaction);
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteTransaction(id);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
          <p className="text-muted-foreground text-center">
            Start tracking your expenses by adding your first transaction.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {transaction.description}
                      </span>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor:
                            categoryColors[
                              transaction.category as keyof typeof categoryColors
                            ],
                        }}
                        className="text-white"
                      >
                        {transaction.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">
                    {formatCurrency(transaction.amount)}
                  </span>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTransaction(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      {editingTransaction && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-amount">Amount</Label>
                            <Input
                              id="edit-amount"
                              type="number"
                              step="0.01"
                              value={editingTransaction.amount}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  amount: parseFloat(e.target.value) || 0,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-description">
                              Description
                            </Label>
                            <Input
                              id="edit-description"
                              value={editingTransaction.description}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select
                              value={editingTransaction.category}
                              onValueChange={(value) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  category: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={editingTransaction.date.split("T")[0]}
                              onChange={(e) =>
                                setEditingTransaction({
                                  ...editingTransaction,
                                  date: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEdit(transaction)}
                              disabled={isEditing}
                              className="flex-1"
                            >
                              {isEditing ? "Saving..." : "Save Changes"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingTransaction(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
