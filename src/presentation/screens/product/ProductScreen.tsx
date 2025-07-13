import {MainLayout} from '../../layouts/MainLayout';
import {
  Button,
  ButtonGroup,
  Input,
  Layout,
  Text,
  useTheme,
} from '@ui-kitten/components';
import {useQuery} from '@tanstack/react-query';
import {RootStackParams} from '../../navigation/StackNavigator';
import {StackScreenProps} from '@react-navigation/stack';
import {getProductById} from '../../../actions/products/get-product-by-id';
import {useRef} from 'react';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {FadeInImage} from '../../components/ui/FadeInImage';
import {Size} from '../../../domain/entities/product';
import {Gender} from '../../../infrastructure/interfaces/teslo-products.response';
import {MyIcon} from '../../components/ui/MyIcon';
import {Formik} from 'formik';

const sizes: Size[] = [Size.Xs, Size.S, Size.M, Size.L, Size.Xl, Size.Xxl];
const gender: Gender[] = [Gender.Kid, Gender.Men, Gender.Women, Gender.Unisex];

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> {}

export const ProductScreen = ({route}: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();

  const {data: product} = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik
      initialValues={product}
      onSubmit={values => console.log('Guardar', values)}>
      {({handleChange, handleSubmit, values, errors, setFieldValue}) => (
        <MainLayout title={values.title} subtitle={`Precio: ${values.price}`}>
          <ScrollView style={{flex: 1}}>
            {/* Imágenes de el producto */}
            <Layout>
              {/* TODO: tener en consideraicón cuando no hay imágenes */}
              <FlatList
                data={values.images}
                keyExtractor={item => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => (
                  <FadeInImage
                    uri={item}
                    style={{width: 300, height: 300, marginHorizontal: 7}}
                  />
                )}
              />
            </Layout>

            {/* Formulario */}
            <Layout style={{marginHorizontal: 10}}>
              <Input
                label="Título"
                value={values.title}
                style={{marginVertical: 5}}
                onChangeText={handleChange('title')}
              />
              <Input
                label="Slug"
                value={values.slug}
                style={{marginVertical: 5}}
                onChangeText={handleChange('slug')}
              />
              <Input
                label="Descripción"
                value={values.description}
                multiline
                numberOfLines={5}
                style={{marginVertical: 5}}
                onChangeText={handleChange('description')}
              />
            </Layout>

            {/* Precio Inventario */}
            <Layout
              style={{
                marginVertical: 5,
                marginHorizontal: 15,
                flexDirection: 'row',
                gap: 10,
              }}>
              <Input
                label="Precio"
                value={values.price.toString()}
                style={{flex: 1}}
              />
              <Input
                label="Inventario"
                value={values.stock.toString()}
                style={{flex: 1}}
              />
            </Layout>

            {/* Selectores */}
            <ButtonGroup
              style={{
                margin: 2,
                marginTop: 30,
                marginHorizontal: 15,
              }}
              size="small"
              appearance="outline">
              {sizes.map(size => (
                <Button
                  key={size}
                  onPress={() =>
                    setFieldValue(
                      'sizes',
                      values.sizes.includes(size)
                        ? values.sizes.filter(s => s !== size)
                        : [...values.sizes, size],
                    )
                  }
                  style={{
                    flex: 1,
                    backgroundColor: values.sizes.includes(size)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {size}
                </Button>
              ))}
            </ButtonGroup>

            <ButtonGroup
              style={{
                margin: 2,
                marginTop: 30,
                marginHorizontal: 15,
              }}
              size="small"
              appearance="outline">
              {gender.map(gender => (
                <Button
                  key={gender}
                  onPress={() => setFieldValue('gender', gender)}
                  style={{
                    flex: 1,
                    backgroundColor: values.gender.startsWith(gender)
                      ? theme['color-primary-200']
                      : undefined,
                  }}>
                  {gender}
                </Button>
              ))}
            </ButtonGroup>

            {/* Botón de guardar */}
            <Button
              accessoryLeft={<MyIcon name="save" white />}
              onPress={() => console.log('Guardar')}
              style={{margin: 15}}>
              Guardar
            </Button>

            <Text>{JSON.stringify(values, null, 3)}</Text>

            <Layout style={{height: 200}} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
