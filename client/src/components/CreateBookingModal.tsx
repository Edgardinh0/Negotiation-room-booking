import React, { useEffect, useState } from "react";
import { format, addMinutes, isBefore, startOfDay, parseISO, differenceInMinutes } from "date-fns";
import { ru } from "date-fns/locale/ru";
import DatePicker, { registerLocale } from "react-datepicker";
import { LuInfo } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/service";
import type { Room } from "@/types/api";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/bookingmodal.css";

registerLocale("ru", ru);

interface CreateBookingModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
  from?: string //Время начала бронирования
  to?: string //Время конца бронирования
}

const DURATION_OPTIONS = [
  { label: "30 минут", minutes: 30 },
  { label: "45 минут", minutes: 45 },
  { label: "1 час", minutes: 60 },
  { label: "1.5 часа", minutes: 90 },
  { label: "2 часа", minutes: 120 },
];

const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export function CreateBookingModal({
  room,
  isOpen,
  onClose,
  defaultDate = new Date(),
  from,
  to
}: CreateBookingModalProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(defaultDate);
  const [startTime, setStartTime] = useState('15:00');
  const [duration, setDuration] = useState(60);
  const [comment, setComment] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    time?: string;
    submit?: string;
  }>({});

  useEffect(() => {
    if (from) {
      const startDate = parseISO(from)
      setSelectedDate(startDate);
      setStartTime(format(startDate, "HH:mm"))

      if (to) {
        const endDate = parseISO(to)
        const diff = differenceInMinutes(endDate, startDate);
          if (diff > 0) {
            setDuration(diff);
        }
      }
    } else {
      setSelectedDate(defaultDate);
      setStartTime(format(defaultDate, "HH:mm"));
    }
  }, [from, to, isOpen])

  if (!isOpen) return null

  // Мутация отправки бронирования
  const mutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: () => {
      // Рефетчим расписание бронирований для этой комнаты
      queryClient.invalidateQueries({ queryKey: ["roomBookings"] });
      // Очищаем форму и закрываем модалку
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      // Вывод ошибки от бэкенда (например, пересечение по времени)
      const message =
        error?.response?.data?.message ||
        "Не удалось забронировать комнату. Возможно, это время уже занято.";
      setErrors((prev) => ({ ...prev, submit: message }));
    },
  });

  const resetForm = () => {
    setTitle("");
    setComment("");
    setErrors({});
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    if (val.length > 4) {
      val = val.slice(0, 4);
    }

    if (val.length >= 3) {
      val = `${val.slice(0, 2)}:${val.slice(2, 4)}`;
    }

    setStartTime(val);
    if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
  };

  const isValidTime = TIME_REGEX.test(startTime);

  let formattedEndTime = "--:--";
  let bookingStart = new Date(selectedDate);
  let bookingEnd = new Date(selectedDate);

  if (isValidTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    bookingStart.setHours(hours, minutes, 0, 0);
    bookingEnd = addMinutes(bookingStart, duration);
    formattedEndTime = format(bookingEnd, "HH:mm");
  }

  const formattedDateTitle = format(selectedDate, "EEEE, d MMMM", { locale: ru });
  const capitalizedDate =
    formattedDateTitle.charAt(0).toUpperCase() + formattedDateTitle.slice(1);
  const durationLabel =
    DURATION_OPTIONS.find((d) => d.minutes === duration)?.label || `${duration} мин`;

  const validate = () => {
    const newErrors: { title?: string; date?: string; time?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Укажите тему встречи";
    }

    const today = startOfDay(new Date());
    if (isBefore(startOfDay(selectedDate), today)) {
      newErrors.date = "Нельзя создать бронирование в прошлом";
    }

    if (!TIME_REGEX.test(startTime)) {
      newErrors.time = "Укажите время в формате ЧЧ:ММ (например, 15:00)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Сбрасываем общую ошибку перед отправкой
    setErrors((prev) => ({ ...prev, submit: undefined }));

    mutation.mutate({
      roomId: room.id,
      title: title.trim(),
      comment: comment.trim(),
      startsAt: bookingStart.toISOString(),
      endsAt: bookingEnd.toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Новое бронирование</h2>
          <p className="modal-subtitle">
            Переговорная{" "}
            <span className="modal-subtitle-highlight">{room.name}</span> (
            {room.office?.name || "Офис"}, {room.floor} этаж)
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Тема встречи */}
          <div className="form-group">
            <label className="form-label">Тема встречи *</label>
            <input
              type="text"
              placeholder="Укажите тему встречи"
              className={`input-field ${errors.title ? "has-error" : ""}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Дата и Время начала */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Дата</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                  }
                }}
                dateFormat="d MMMM, EE"
                locale="ru"
                customInput={
                  <input
                    className={`input-field ${errors.date ? "has-error" : ""}`}
                  />
                }
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Время начала</label>
              <input
                type="text"
                placeholder="15:00"
                maxLength={5}
                className={`input-field ${errors.time ? "has-error" : ""}`}
                value={startTime}
                onChange={handleTimeChange}
              />
              {errors.time && <span className="error-text">{errors.time}</span>}
            </div>
          </div>

          {/* Продолжительность */}
          <div className="form-group">
            <label className="form-label">Продолжительность</label>
            <select
              className="select-field"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.minutes} value={opt.minutes}>
                  {opt.label}{" "}
                  {isValidTime
                    ? `(до ${format(addMinutes(bookingStart, opt.minutes), "HH:mm")})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Комментарий */}
          <div className="form-group">
            <label className="form-label">Комментарий</label>
            <textarea
              placeholder="Дополнительная информация для участников встречи..."
              className="textarea-field"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* Информационный баннер */}
          <div className="info-banner">
            <LuInfo className="info-banner-icon" />
            <span>
              {isValidTime
                ? `Бронирование на ${capitalizedDate}, ${startTime} - ${formattedEndTime} (${durationLabel})`
                : "Укажите корректное время начала"}
            </span>
          </div>

          {/* Сообщение об ошибке от API */}
          {errors.submit && (
            <div className="error-text" style={{ marginBottom: "16px", textAlign: "center" }}>
              {errors.submit}
            </div>
          )}

          {/* Кнопки управления */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Сохранение..." : "Забронировать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}