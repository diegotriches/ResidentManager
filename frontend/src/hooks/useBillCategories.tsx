import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getBillsCategories,
  createBillCategory,
  updateBillsCategories,
  deleteBillsCategories,
} from "../services/billsCategoriesService";
import { queryKeys } from "../keys/queryKeys";

interface useBillCategoriesProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
    onConfirm?: () => void;
  }) => void;
}

interface BillsCategories {
  id?: number;
  categoryName: string;
}

export const useBillCategories = ({
  setModalConfig,
}: useBillCategoriesProps) => {
  const queryClient = useQueryClient();

  const initialForm: BillsCategories = {
    categoryName: "",
  };

  const [formData, setFormData] = useState<BillsCategories>(initialForm);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data: categories = [], isLoading: isLoading } = useQuery({
    queryKey: queryKeys.billsCategories.lists(),
    queryFn: () => getBillsCategories(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.billsCategories.all });
  };

  const resetForm = () => {
    setFormData(initialForm);
    setCategoryId(null);
  };

  const createMutation = useMutation({
    mutationFn: createBillCategory,
    onSuccess: () => {
      invalidate();
      toast.success("Categoria cadastrada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao cadastrar categoria:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: BillsCategories }) =>
      updateBillsCategories(id, data),
    onSuccess: () => {
      invalidate();
      toast.success("Categoria atualizada com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao atualizar conta:", error);
      toast.error("Ocorreu um erro ao processar a solicitação.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBillsCategories,
    onSuccess: () => {
      invalidate();
      toast.success("Categoria removida com sucesso!");
      setCategoryId(null);
    },
    onError: (error) => {
      console.error("Erro ao deletar cadastro:", error);
      toast.error("Ocorreu um problema ao tentar excluir o cadastro.");
    },
  });

  const handleSubmit = async (): Promise<boolean> => {
    try {
      if (categoryId) {
        await updateMutation.mutateAsync({ id: categoryId, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (category: BillsCategories) => {
    setCategoryId(category.id ?? null);
    setFormData({
      categoryName: category.categoryName,
    });
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const deleteRequest = (id: number) => {
    setCategoryId(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: "Tem certeza que deseja excluir esta categoria?",
      type: "confirm",
      onConfirm: () => handleDelete(id),
    });
  };

  return {
    loading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    isFormModalOpen,
    setIsFormModalOpen,
    categories,
    formData,
    categoryId,
    handleChange,
    handleEdit,
    handleSubmit,
    deleteRequest,
    resetForm,
  };
};
