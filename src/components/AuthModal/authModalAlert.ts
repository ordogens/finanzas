import Swal from "sweetalert2";

export const showAuthSuccessAlert = async (title: string, text: string) => {
  await Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonText: "Listo",
    background: "#0f172a",
    color: "#f1f5f9",
    confirmButtonColor: "#2563eb",
    customClass: {
      popup: "rounded-[2rem]",
      confirmButton: "rounded-2xl",
    },
  });
};
