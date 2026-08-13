import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getApartments,
  createApartments,
  deleteApartments,
  updateApartments,
} from "../services/apartmentsService";
import { queryKeys } from "../keys/queryKeys";
import type { ApartmentsData, Apartment } from "../types/apartments";

interface useApartmentsFormProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert";
  }) => void;
}

export const useApartments = ({ setModalConfig }: useApartmentsFormProps) => {
  const queryClient = useQueryClient();

  const initialForm = {
    apartment: "",
    ownerName: "",
  };

  const [formData, setFormData] = useState<ApartmentsData>(initialForm);
  const [apartmentId, setApartmentId] = useState<number | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const { data: apartments = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.apartments.all,
    queryFn: getApartments,
    select: (data) =>
      [...data].sort((a, b) =>
        String(a.apartment).localeCompare(String(b.apartment)),
      ),
  });

  const totalApartments = apartments.length;

  const resetForm = () => {
    setFormData(initialForm);
    setApartmentId(null);
  };

  const createMutation = useMutation({
    mutationFn: createApartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      toast.success("Apartamento cadastrado com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro no cadastro:", error);
      toast.error("Ocorreu um erro ao cadastrar o apartamento.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ApartmentsData }) =>
      updateApartments(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      toast.success("Apartamento atualizado com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro na atualização:", error);
      toast.error("Ocorreu um erro ao atualizar o apartamento.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteApartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.apartments.all });
      toast.success("Apartamento removido com sucesso!");
      setIsFormModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Erro ao deletar:", error);
      toast.error("Ocorreu um problema ao tentar excluir o apartamento.");
    },
  });

  const handleSubmit = () => {
    if (!apartmentId) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate({ id: apartmentId, data: formData });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (a: Apartment) => {
    setApartmentId(a.id);
    setFormData({
      apartment: a.apartment,
      ownerName: a.ownerName,
    });
  };

  const deleteRequest = (id: number) => {
    setApartmentId(id);
    setModalConfig({
      isOpen: true,
      title: "Confirmação",
      message: "Tem certeza que deseja excluir este apartamento?",
      type: "confirm",
    });
  };

  const handleDelete = () => {
    if (apartmentId) {
      deleteMutation.mutate(apartmentId);
    }
  };

  return {
    initialForm,
    apartments,
    loading:
      loading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    totalApartments,
    apartmentId,
    setApartmentId,
    formData,
    setFormData,
    isFormModalOpen,
    setIsFormModalOpen,
    handleSubmit,
    handleChange,
    handleEdit,
    deleteRequest,
    handleDelete,
    resetForm,
  };
};
