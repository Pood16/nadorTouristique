import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { PlusCircle, Trash2, ChevronLeft } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import {
  fetchLocationById, createLocation, updateLocation, clearCurrentLocation,
} from '@/store/slices/locationsSlice';
import { ROUTES } from '@/constants/routes';
import { CATEGORIES } from '@/constants/categories';
import type { LocationFormData } from '@/types';
import Button from '@/components/common/Button';
import { FullPageSpinner } from '@/components/common/Spinner';

const DAYS = [
  { key: 'monday',    label: 'Lundi' },
  { key: 'tuesday',   label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday',  label: 'Jeudi' },
  { key: 'friday',    label: 'Vendredi' },
  { key: 'saturday',  label: 'Samedi' },
  { key: 'sunday',    label: 'Dimanche' },
] as const;

type DayKey = typeof DAYS[number]['key'];

const schema: yup.ObjectSchema<LocationFormData> = yup.object({
  name: yup.string().required('Le nom est obligatoire').min(2, 'Minimum 2 caractères'),
  category: yup.mixed<LocationFormData['category']>().required('La catégorie est obligatoire'),
  shortDescription: yup.string().required('La description courte est obligatoire').max(200),
  description: yup.string().required('La description est obligatoire'),
  images: yup.array().of(yup.string().url('URL invalide').required()).default([]),
  hours: yup.mixed<LocationFormData['hours']>().notRequired(),
  pricing: yup.string().notRequired(),
  address: yup.string().notRequired(),
  transport: yup.mixed<LocationFormData['transport']>().notRequired(),
  status: yup.mixed<'active' | 'inactive'>().oneOf(['active', 'inactive']).required(),
});

const defaultHours = (): LocationFormData['hours'] => {
  const blank = { open: false, from: '09:00', to: '18:00' };
  return {
    monday: { ...blank }, tuesday: { ...blank }, wednesday: { ...blank },
    thursday: { ...blank }, friday: { ...blank }, saturday: { ...blank }, sunday: { ...blank },
  };
};

export default function LocationFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentLocation, loading } = useAppSelector((s) => s.locations);

  const [hours, setHours] = useState<LocationFormData['hours']>(defaultHours());
  const [transport, setTransport] = useState<LocationFormData['transport']>([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, reset, formState: { errors }, control } = useForm<LocationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '', category: 'beaches', shortDescription: '', description: '',
      images: [], status: 'active',
    },
  });

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control, name: 'images' as never,
  });

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchLocationById(id));
    }
    return () => { dispatch(clearCurrentLocation()); };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentLocation) {
      reset({
        name: currentLocation.name,
        category: currentLocation.category,
        shortDescription: currentLocation.shortDescription,
        description: currentLocation.description,
        images: currentLocation.images ?? [],
        pricing: currentLocation.pricing ?? '',
        address: currentLocation.address ?? '',
        status: currentLocation.status,
      });
      setHours(currentLocation.hours ?? defaultHours());
      setTransport(currentLocation.transport ?? []);
    }
  }, [currentLocation, isEdit, reset]);

  const addTransport = () => setTransport((prev) => [...(prev ?? []), { type: 'car', details: '' }]);
  const removeTransport = (i: number) => setTransport((prev) => (prev ?? []).filter((_, idx) => idx !== i));
  const updateTransport = (i: number, field: 'type' | 'details', val: string) =>
    setTransport((prev) => (prev ?? []).map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const toggleDay = (day: DayKey) =>
    setHours((prev) => ({ ...prev!, [day]: { ...prev![day], open: !prev![day].open } }));
  const updateDayHour = (day: DayKey, field: 'from' | 'to', val: string) =>
    setHours((prev) => ({ ...prev!, [day]: { ...prev![day], [field]: val } }));

  const onSubmit = async (data: LocationFormData) => {
    setSubmitting(true);
    const payload: LocationFormData = {
      ...data,
      hours,
      transport,
      images: data.images ?? [],
    };
    try {
      if (isEdit && id) {
        await dispatch(updateLocation({ id: Number(id), data: payload })).unwrap();
        toast.success('Lieu mis à jour avec succès.');
      } else {
        await dispatch(createLocation(payload)).unwrap();
        toast.success('Lieu créé avec succès.');
      }
      navigate(ROUTES.ADMIN_LOCATIONS);
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && loading && !currentLocation) return <FullPageSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to={ROUTES.ADMIN_LOCATIONS} className="text-neutral-500 hover:text-primary-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-neutral-950">
          {isEdit ? 'Modifier le lieu' : 'Nouveau lieu'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic info */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-neutral-800">Informations générales</h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nom *</label>
            <input {...register('name')} className="input w-full" placeholder="Ex: Plage Marchica" />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Catégorie *</label>
              <select {...register('category')} className="input w-full">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Statut *</label>
              <select {...register('status')} className="input w-full">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description courte * <span className="text-neutral-400">(max 200 car.)</span></label>
            <textarea {...register('shortDescription')} rows={2} className="input w-full resize-none" placeholder="Résumé en 1-2 phrases…" />
            {errors.shortDescription && <p className="text-xs text-red-600 mt-1">{errors.shortDescription.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description complète *</label>
            <textarea {...register('description')} rows={5} className="input w-full resize-none" placeholder="Description détaillée…" />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Adresse</label>
            <input {...register('address')} className="input w-full" placeholder="Ex: Rue des Fleurs, Nador" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Tarifs / Prix</label>
            <input {...register('pricing')} className="input w-full" placeholder="Ex: Entrée libre, 20 MAD / adulte…" />
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Images (URLs)</h2>
            <Button type="button" variant="outline" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => addImage('')}>
              Ajouter
            </Button>
          </div>
          {imageFields.length === 0 && (
            <p className="text-sm text-neutral-400 italic">Aucune image ajoutée.</p>
          )}
          {imageFields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-center">
              <input
                {...register(`images.${i}`)}
                className="input flex-1"
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" variant="icon" className="text-red-500 hover:text-red-700" onClick={() => removeImage(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </section>

        {/* Hours */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-800">Horaires d'ouverture</h2>
          <div className="space-y-2">
            {DAYS.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-4">
                <label className="flex items-center gap-2 min-w-[140px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hours?.[key]?.open ?? false}
                    onChange={() => toggleDay(key)}
                    className="accent-primary-600"
                  />
                  <span className="text-sm text-neutral-700">{label}</span>
                </label>
                {hours?.[key]?.open ? (
                  <>
                    <input type="time" value={hours[key].from} onChange={(e) => updateDayHour(key, 'from', e.target.value)}
                      className="input w-28 text-sm" />
                    <span className="text-neutral-400 text-sm">–</span>
                    <input type="time" value={hours[key].to} onChange={(e) => updateDayHour(key, 'to', e.target.value)}
                      className="input w-28 text-sm" />
                  </>
                ) : (
                  <span className="text-sm text-neutral-400 italic">Fermé</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Transport */}
        <section className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-800">Options de transport</h2>
            <Button type="button" variant="outline" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={addTransport}>
              Ajouter
            </Button>
          </div>
          {(transport ?? []).length === 0 && (
            <p className="text-sm text-neutral-400 italic">Aucune option ajoutée.</p>
          )}
          {(transport ?? []).map((t, i) => (
            <div key={i} className="flex gap-2 items-center">
              <select
                value={t.type}
                onChange={(e) => updateTransport(i, 'type', e.target.value)}
                className="input w-36 text-sm"
              >
                <option value="bus">Bus</option>
                <option value="taxi">Taxi</option>
                <option value="car">Voiture</option>
                <option value="parking">Parking</option>
                <option value="walk">À pied</option>
                <option value="ferry">Ferry</option>
              </select>
              <input
                value={t.details}
                onChange={(e) => updateTransport(i, 'details', e.target.value)}
                className="input flex-1 text-sm"
                placeholder="Détails…"
              />
              <Button type="button" variant="icon" className="text-red-500 hover:text-red-700" onClick={() => removeTransport(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </section>

        {/* Actions */}
        <div className="flex gap-3 justify-end pb-10">
          <Link to={ROUTES.ADMIN_LOCATIONS}>
            <Button type="button" variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {isEdit ? 'Enregistrer les modifications' : 'Créer le lieu'}
          </Button>
        </div>
      </form>
    </div>
  );
}
