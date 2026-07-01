import { useCallback, useEffect, useState } from "react";
import {
  createApartments,
  deleteApartments,
  getApartments,
  updateApartments,
} from "../services/apartmentsService";
import type { ApartmentsData, Apartment } from "../types/apartments";

interface useApartmentsFormProps {
  setModalConfig: (config: {
    isOpen: boolean;
    message: string;
    title: string;
    type: "confirm" | "alert"
  }) => void;
}

export const useApartments = ({ setModalConfig }: useApartmentsFormProps) => {
  const initialForm = {
    number: 0,
    ownerName: "",
  };

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [formData, setFormData] = useState<ApartmentsData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [apartmentId, setApartmentId] = useState<number | null>(
    null,
  );

  const fetchApartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApartments();
      setApartments(response);
    } catch (error) {
      console.error("Erro ao carregar apartamentos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  const handleSubmit = async () => {
    try {
      if (!apartmentId) {
        await createApartments(formData);
        setModalConfig({
          isOpen: true,
          title: "Cadastro",
          message: "Apartamento cadastrado com sucesso!",
          type: "alert",
        });
      } else {
        await updateApartments(apartmentId, formData);
        setModalConfig({
          isOpen: true,
          title: "Atualização",
          message: "Apartamento atualizado com sucesso!",
          type: "alert",
        });
      }

      setFormData(initialForm);
      setApartmentId(null);
      await fetchApartments();

      return true;
    } catch (error) {
      console.error("Erro na operação:", error);
      setModalConfig({
          isOpen: true,
          title: "Erro",
          message: "Ocorreu um erro ao processar a solicitação.",
          type: "alert",
        });
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const finalValue = name === "number" ? Number(value) : value;

    setFormData((prev) => {
      const newData = { ...prev, [name]: finalValue };
      return newData;
    });
  };

  const handleEdit = (apartment: Apartment) => {
    setApartmentId(apartment.id);
    setFormData({
      number: apartment.number,
      ownerName: apartment.ownerName,
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
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteApartments(id);
      await fetchApartments();
      setModalConfig({
          isOpen: true,
          title: "Sucesso",
          message: "Apartamento removido com sucesso!",
          type: "alert",
        });
    } catch (error) {
      console.error("Erro ao deletar apartamento:", error);
      setModalConfig({
          isOpen: true,
          title: "Erro",
          message: "Ocorreu um problema ao tentar excluir a medição.",
          type: "alert",
        });
    }
  };

  return {
    initialForm,
    apartments,
    loading,
    apartmentId,
    formData,
    setFormData,
    handleSubmit,
    handleChange,
    handleEdit,
    deleteRequest,
    handleDelete,
  };
};
