import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PlusCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchEvents, createEvent, updateEvent, toggleEventStatus, deleteEvent } from '@/store/slices/eventsSlice';
import type { AppEvent, EventFormData } from '@/types';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import Modal, { ConfirmModal } from '@/components/common/Modal';
import EmptyState from '@/components/common/EmptyState';
import { FullPageSpinner } from '@/components/common/Spinner';

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

const emptyForm: EventFormData = {
  title: '', date: '', location: '', description: '', status: 'active',
};

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.events);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AppEvent | null>(null);
  const [form, setForm] = useState<EventFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [deleteTarget, setDeleteTarget] = useState<AppEvent | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (ev: AppEvent) => {
    setEditing(ev);
    setForm({ title: ev.title, date: ev.date, location: ev.location, description: ev.description, status: ev.status });
    setErrors({});
    setModalOpen(true);
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Le titre est obligatoire.';
    if (!form.date) errs.date = 'La date est obligatoire.';
    if (!form.location.trim()) errs.location = 'Le lieu est obligatoire.';
    if (!form.description.trim()) errs.description = 'La description est obligatoire.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await dispatch(updateEvent({ id: editing.id, data: form })).unwrap();
        toast.success('Événement mis à jour.');
      } else {
        await dispatch(createEvent(form)).unwrap();
        toast.success('Événement créé.');
      }
      setModalOpen(false);
    } catch (e) {
      toast.error(typeof e === 'string' ? e : 'Erreur.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (ev: AppEvent) => {
    const next = ev.status === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(toggleEventStatus({ id: ev.id, status: next })).unwrap();
      toast.success(`Événement ${next === 'active' ? 'activé' : 'désactivé'}.`);
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Erreur.'); }
  };

  const handleDelete = async (ev: AppEvent) => {
    try {
      await dispatch(deleteEvent(ev.id)).unwrap();
      toast.success('Événement supprimé.');
    } catch (e) { toast.error(typeof e === 'string' ? e : 'Erreur.'); }
    setDeleteTarget(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-950">Gestion des Événements</h1>
        <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />} onClick={openCreate}>
          Nouvel événement
        </Button>
      </div>

      {loading ? (
        <FullPageSpinner />
      ) : items.length === 0 ? (
        <EmptyState title="Aucun événement" description="Créez votre premier événement en cliquant sur le bouton ci-dessus." />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  <th className="text-left px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Titre</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold hidden lg:table-cell">Lieu</th>
                  <th className="text-left px-4 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Statut</th>
                  <th className="text-right px-6 py-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((ev) => (
                  <tr key={ev.id} className="border-t border-neutral-100 hover:bg-primary-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-neutral-900">{ev.title}</p>
                      <p className="text-xs text-neutral-400 md:hidden mt-0.5">{formatDate(ev.date)}</p>
                    </td>
                    <td className="px-4 py-4 text-neutral-600 hidden md:table-cell">{formatDate(ev.date)}</td>
                    <td className="px-4 py-4 text-neutral-600 hidden lg:table-cell">{ev.location}</td>
                    <td className="px-4 py-4">
                      <Badge variant={ev.status === 'active' ? 'active' : 'inactive'}>
                        {ev.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="icon" aria-label="Modifier" onClick={() => openEdit(ev)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="icon" aria-label={ev.status === 'active' ? 'Désactiver' : 'Activer'} onClick={() => handleToggle(ev)}>
                          {ev.status === 'active'
                            ? <ToggleRight className="w-5 h-5 text-accent-500" />
                            : <ToggleLeft className="w-5 h-5 text-neutral-400" />}
                        </Button>
                        <Button variant="icon" aria-label="Supprimer" className="hover:text-red-600" onClick={() => setDeleteTarget(ev)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={modalOpen}
        title={editing ? "Modifier l'événement" : 'Nouvel événement'}
        onClose={() => setModalOpen(false)}
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button variant="primary" isLoading={saving} onClick={handleSave}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 p-1">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Titre *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input" placeholder="Ex: Festival de la Mer" />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input" />
              {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Statut</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
                className="input">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Lieu *</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input" placeholder="Ex: Plage Marchica, Nador" />
            {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4} className="input resize-none" placeholder="Description de l'événement…" />
            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          open
          title="Supprimer l'événement"
          message={`Supprimer « ${deleteTarget.title} » ? Cette action est irréversible.`}
          variant="danger"
          confirmLabel="Supprimer"
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
