import Swal from "sweetalert2";

export const showAlert = async ( type = "info",title, message,) => {
  const toastBase = {
    toast: true,
    position: "top",
    title,
    text: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  };

  switch (type) {
    case "success":
      return Swal.fire({
        ...toastBase,
        icon: "success",
        background: "#e0f7fa",
        color: "#004d40",
      });

    case "error":
      return Swal.fire({
        ...toastBase,
        icon: "error",
        background: "#ffebee",
        color: "#b71c1c",
      });

    case "warning":
      return Swal.fire({
        ...toastBase,
        icon: "warning",
        background: "#fff3cd",
        color: "#856404",
      });

    case "info":
      return Swal.fire({
        ...toastBase,
        icon: "info",
        background: "#d1ecf1",
        color: "#0c5460",
      });

    case "confirm":
      const confirm = await Swal.fire({
        title,
        text: message,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
      });
      return confirm.isConfirmed;

    case "confirmDelete":
      for (let i = 1; i <= 5; i++) {
        const result = await Swal.fire({
          title: `${title} (${i}/5)`,
          text: message,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: i < 5 ? `Yes, continue (${i}/5)` : "Yes, delete it!",
          cancelButtonText: "Cancel",
        });
        if (!result.isConfirmed) return false;
      }
      return true;

    default:
      return Swal.fire({
        title,
        text: message,
        icon: "info",
        confirmButtonColor: "#3085d6",
      });
  }
};
