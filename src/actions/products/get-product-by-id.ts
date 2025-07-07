import {tesloApi} from '../../config/api/tesloApi';
import {TesloProduct} from '../../infrastructure/interfaces/teslo-products.response';
import {ProductMapper} from '../../infrastructure/mappers/product.mapper';

export const getProductById = async (id: string) => {
  try {
    const {data} = await tesloApi.get<TesloProduct>(`/products/${id}`);

    return ProductMapper.tesloProductoToEntity(data);
  } catch (error) {
    console.log(error);
    throw new Error('Error getting product by id: ' + id);
  }
};
