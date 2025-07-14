import {isAxiosError} from 'axios';
import {tesloApi} from '../../config/api/tesloApi';
import {Product} from '../../domain/entities/product';
import {create} from 'zustand';

export const updateCreateProduct = async (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  if (product.id && product.id !== 'new') {
    return updateProduct(product);
  }

  return createProduct(product);
};

const prepareImages = async (images: string[]) => {
  // TODO: revisar los FILES
  const fileImages = images.filter(image => image.includes('file://'));
  const currentImages = images.filter(image => !image.includes('file://'));

  if (fileImages.length > 0) {
    const uploadPromises = fileImages.map(uploadImage);
    const uploadedImages = await Promise.all(uploadPromises);
    currentImages.push(...uploadedImages);
  }

  return currentImages.map(image => image.split('/').pop());
};

const uploadImage = async (image: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: image,
    type: 'image/jpeg', // or the appropriate MIME type
    name: image.split('/').pop() || 'image.jpg',
  });

  const {data} = await tesloApi.post<{image: string}>(
    '/files/product/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data.image;
};

// TODO: revisar si viene el usuario
const updateProduct = async (product: Partial<Product>) => {
  //   console.log({product});

  const {id, images = [], ...rest} = product;

  try {
    const checkedImages = await prepareImages(images);
    // console.log({checkedImages});

    const {data} = await tesloApi.patch<Product>(`/products/${id}`, {
      images: checkedImages,
      ...rest,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Axios error updating product:', error.response?.data);
    }
    console.error('Error updating product:', error);
    throw new Error('Error updating product');
  }
};

const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const {id, images = [], ...rest} = product;

  try {
    const checkedImages = await prepareImages(images);

    const {data} = await tesloApi.post(`/products/`, {
      images: checkedImages,
      ...rest,
    });

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error('Axios error updating product:', error.response?.data);
    }
    console.error('Error updating product:', error);
    throw new Error('Error updating product');
  }
};
