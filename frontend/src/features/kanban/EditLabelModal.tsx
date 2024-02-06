import { useContext, useState } from "react";
import { Labels, Task } from "./Kanban";
import { CreateLabelFormValues } from "./CreateLabelModal";
import { ColorModal } from "./ColorModal";
import { FieldErrors, useForm } from "react-hook-form";
import { createLabelSchema } from "./labelValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubModalContext } from "./SubModal";
import { DeleteModal } from "../../components/DeleteModal";

interface ColorProps {
  task: Task;
  labelColors: Labels[];
  label: Labels;
  editLabel: (id: string | number, name: string, color: string) => void;
  deleteLabel: (id: string | number) => void;
}

export const EditLabelModal = ({
  labelColors,
  label,
  editLabel,
  deleteLabel,
}: ColorProps) => {
  const { closeModal } = useContext(SubModalContext);
  const [confirmDeleteEdit, setConfirmDeleteEdit] = useState(false);
  const {
    formState: { isDirty, errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<CreateLabelFormValues>({
    defaultValues: {
      name: "",
      color: "",
    },
    resolver: yupResolver(createLabelSchema),
  });

  const [formError, setFormError] = useState<null | string>(null);

  const onError = (errors: FieldErrors<CreateLabelFormValues>) => {
    console.log("Form field errors:", errors);
  };
  const canSubmit = isDirty;

  const onHandleSubmit = (formData: CreateLabelFormValues) => {
    if (canSubmit) {
      try {
        editLabel(label.id, formData.name, formData.color);
        closeModal();
        reset();
        setFormError(null);
      } catch (err) {
        onError;
        console.error("Failed to update label", err);
        if (
          err &&
          typeof err === "object" &&
          "data" in err &&
          err.data &&
          typeof err.data === "object"
        ) {
          const errorMessage = Object.values(err.data);
          setFormError(errorMessage.toString());
        }
      }
    }
  };

  const onHandleDelete = () => {
    try {
      deleteLabel(label.id);
      reset();
      setFormError(null);
    } catch (err) {
      onError;
      console.error("Failed to delete label", err);
      if (
        err &&
        typeof err === "object" &&
        "data" in err &&
        err.data &&
        typeof err.data === "object"
      ) {
        const errorMessage = Object.values(err.data);
        setFormError(errorMessage.toString());
      }
    }
  };

  return (
    <>
      <form>
        <label className="block mb-3.5 heading-xs text-left text-dark-font">
          Title
          <input
            type="text"
            {...register("name")}
            placeholder={label.name}
            className="block w-full body-text-sm py-1 px-2 mt-1.5 border-grayscale-300"
          />
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.name?.message}
          </p>
        </label>
        <label className="block heading-xs text-left text-dark-font">
          Select a Color
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {errors.color?.message}
          </p>
          <p className="mt-1 text-center body-text-xs text-caution-200">
            {formError}
          </p>
        </label>
        <div className="grid grid-cols-3 gap-2 mt-1.5">
          {labelColors.map((label) => (
            <ColorModal
              key={label.id}
              setValue={setValue}
              label={label}
            ></ColorModal>
          ))}
        </div>
        <section className="border grid grid-cols-2 gap-6 mt-3.5">
          <button
            onClick={handleSubmit(onHandleSubmit, onError)}
            name="save"
            className="py-2 btn-text-xs bg-success-100 hover:bg-success-200"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteEdit(true)}
            name="delete"
            className="py-2 btn-text-xs bg-caution-100 hover:bg-caution-200"
          >
            Delete
          </button>
          {confirmDeleteEdit && (
            <DeleteModal
              setConfirmDeleteEdit={setConfirmDeleteEdit}
              confirmDeleteEdit={confirmDeleteEdit}
              handleSubmitForModal={onHandleDelete}
              deleteModalText={"Are you sure you want to delete this label?"}
            />
          )}
        </section>
      </form>
    </>
  );
};
