import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import useQueryConfig from 'src/hooks/useQueryConfig';
import { Schema, schema } from 'src/utils/rules';
import omit from 'lodash/omit';
import { createSearchParams, useNavigate } from 'react-router-dom';
import path from 'src/constants/path';

type FormData = Pick<Schema, 'name'>;
const nameSchema = schema.pick(['name']);

const useSearchProducts = () => {
    const { handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            name: '',
        },
        resolver: yupResolver(nameSchema),
    });
    const queryConfig = useQueryConfig();
    const navigate = useNavigate();

    const onSubmitSearch = handleSubmit((data) => {
        const config = queryConfig.order
            ? omit(
                  {
                      ...queryConfig,
                      name: data.name,
                  },
                  ['order', 'sort_by'],
              )
            : {
                  ...queryConfig,
                  name: data.name,
              };
        navigate({
            pathname: path.home,
            search: createSearchParams(config).toString(),
        });
    });
    return { onSubmitSearch, register };
};

export default useSearchProducts;
