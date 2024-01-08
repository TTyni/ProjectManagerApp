import * as React from "react";
interface propTypes {
  confirmDeleteEdit: boolean;
  setConfirmDeleteEdit: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitForModal: () => void;
  deleteModalText: string;
}
export const DeleteModal: React.FunctionComponent<propTypes> = ({
  confirmDeleteEdit,
  setConfirmDeleteEdit,
  handleSubmitForModal,
  deleteModalText,
}) => {
  return (
    <div
      className={`flex justify-center items-center fixed inset-0 transition-colors ${
        confirmDeleteEdit ? "visible bg-dark-blue-100/20" : "invisible"
      }`}
    >
      <div
        className={`rounded-lg shadow p-2 transition-all bg-grayscale-100  ${
          confirmDeleteEdit ? "scale-100 opacity-100" : "scale-110 opacity-0"
        }`}
      >
        <div className="flex justify-end">
          <button
            className="w-12 bg-grayscale-0 px-2 py-2 hover:bg-grayscale-0"
            onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
          >
            x
          </button>
        </div>

        <div className="px-8">
          <p>{deleteModalText}</p>
          <button
            onClick={() => {
              handleSubmitForModal();
              setConfirmDeleteEdit(!confirmDeleteEdit);
            }}
            className="my-4 btn-text-xs px-4 py-1.5 outline-none focus:outline focus:outline-caution-100 bg-caution-100 hover:bg-caution-200"
          >
            Yes, I am sure
          </button>
          <button
            onClick={() => setConfirmDeleteEdit(!confirmDeleteEdit)}
            className="my-4 ml-20 btn-text-xs px-8 py-1.5 outline-none focus:outline focus:outline-primary-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};