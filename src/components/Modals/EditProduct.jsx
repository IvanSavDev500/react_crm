import React, { useEffect, useLayoutEffect, useState } from "react";

import DialogActions from "@mui/material/DialogActions";
import { useForm } from "../../hooks/useForm";
import { Errors } from "../../consts/consts";
import { capitalizeFirstLetter, haveErrors } from "../../utils/utils";
import ModalButton from "../Buttons/ModalButton";
import ModalInput from "./ModalInput";
import ModalTitle from "./ModalTitle";
import ModalInputContainer from "./ModalInputContainer";
import ModalContainer from "./ModalContainer";
import useAccounts from "../../hooks/useAccounts";
import useAccount from "../../hooks/useAccount";
import useProducts from "../../hooks/useProducts";

const initialStateForm = {
  store: "",
  price: "",
  productName: "",
  category: "",
  remains: "",
  weight: "",
};

const initialStateErrors = {
  store: null,
  price: null,
  productName: null,
  category: null,
  remains: null,
  weight: null,
};

const fieldsNames = [
  "store",
  "price",
  "productName",
  "category",
  "remains",
  "weight",
];

const EditProduct = ({ open, closeModal, id }) => {
  const [errors, setErrors] = useState({ ...initialStateErrors });
  const [form, setForm] = useForm({ ...initialStateForm });
  const { getProduct, updateProduct } = useProducts();

  useLayoutEffect(() => {
    setForm(getProduct(id));
  }, [getProduct, setForm]);

  console.log(form);
  const handleSubmit = () => {
    const { store, price, productName, category, remains, weight } = form;
    const checkedErrors = {
      store: store.length > 0 ? null : Errors.requiredField,
      price: Number(price) > 0 ? null : Errors.moreZero,
      productName: productName.length > 0 ? null : Errors.requiredField,
      category: category.length > 0 ? null : Errors.requiredField,
      remains: Number(remains) > 0 ? null : Errors.moreZero,
      weight: Number(weight) > 0 ? null : Errors.moreZero,
    };

    const isNotErrors = haveErrors(checkedErrors);
    if (isNotErrors) {
      updateProduct(id, { ...form });
      setForm({ ...initialStateForm });
      closeModal();
    }

    setErrors(checkedErrors);
  };

  const handleChange = ({ target }) => setForm({ [target.name]: target.value });

  const handleClose = () => {
    setForm({ ...initialStateForm });
    setErrors({ ...initialStateErrors });
    closeModal();
  };

  return (
    <ModalContainer open={open} onClose={handleClose}>
      <ModalTitle handleClose={handleClose}>Editing a product</ModalTitle>
      <ModalInputContainer errors={errors}>
        {fieldsNames.map((fieldName) => (
          <ModalInput
            key={fieldName}
            id={fieldName}
            name={fieldName}
            label={capitalizeFirstLetter(fieldName)}
            variant="outlined"
            error={Boolean(errors[fieldName])}
            helperText={errors[fieldName]}
            onChange={handleChange}
            value={form[fieldName]}
            errors={haveErrors(errors)}
          />
        ))}
      </ModalInputContainer>
      <DialogActions>
        <ModalButton onClick={handleSubmit}>Add Product +</ModalButton>
      </DialogActions>
    </ModalContainer>
  );
};

export default EditProduct;