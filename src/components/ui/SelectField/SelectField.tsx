import { Check, ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Chevron } from "../Chevron/Chevron";
import { useMediaQuery } from "../useMediaQuery";
import { computeListPosition } from "./position";

const TYPE_AHEAD_RESET_MS = 600;

export interface SelectOption {
  value: string;
  label: string;
  lang?: string;
}

interface SelectFieldProps {
  label: string;
  showLabel?: boolean;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  icon?: ReactNode;
  layout?: "popover" | "inline";
}

function NativeSelect({ label, showLabel, value, options, onChange, icon }: SelectFieldProps) {
  return (
    <label className="select-field select-field--native">
      <span className={showLabel ? "select-field__label" : "visually-hidden"}>{label}</span>
      <span className="select-field__trigger">
        {icon}
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value} lang={option.lang}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden />
      </span>
    </label>
  );
}

function CustomSelect({
  label,
  showLabel,
  value,
  options,
  onChange,
  icon,
  layout = "popover",
}: SelectFieldProps) {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const typeAheadRef = useRef({ text: "", timer: 0 });
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const isPopover = layout === "popover";

  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const close = useCallback((shouldRestoreFocus: boolean) => {
    setIsOpen(false);
    if (shouldRestoreFocus) triggerRef.current?.focus();
  }, []);

  const choose = (index: number) => {
    onChange(options[index].value);
    close(true);
  };

  const position = useCallback(() => {
    const list = listRef.current;
    const trigger = triggerRef.current;
    if (!list || !trigger || !isPopover) return;
    const result = computeListPosition(
      trigger.getBoundingClientRect(),
      { width: list.offsetWidth, height: list.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
    );
    list.style.left = `${result.left}px`;
    list.style.top = `${result.top}px`;
    list.dataset.placement = result.placement;
  }, [isPopover]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (!isOpen) {
      if (isPopover && list.matches(":popover-open")) list.hidePopover();
      return;
    }

    if (isPopover) {
      list.showPopover();
      position();
    }
    list.focus({ preventScroll: true });

    const onPointerDown = (event: PointerEvent) => {
      if (
        !wrapperRef.current?.contains(event.target as Node) &&
        !list.contains(event.target as Node)
      ) {
        close(false);
      }
    };
    // Like a native select on desktop: scrolling the page or any container closes the list (its own
    // scrolling does not), so it is never left behind a moving container.
    const onScroll = (event: Event) => {
      if (isPopover && !list.contains(event.target as Node)) close(true);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [isOpen, isPopover, position, close]);

  useEffect(() => {
    if (!isOpen) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isOpen]);

  const typeAhead = (key: string) => {
    const state = typeAheadRef.current;
    window.clearTimeout(state.timer);
    state.text += key.toLocaleLowerCase();
    state.timer = window.setTimeout(() => {
      state.text = "";
    }, TYPE_AHEAD_RESET_MS);
    const ordered = [...options.keys()].map((index) => (index + activeIndex) % options.length);
    const match = ordered.find((index) =>
      options[index].label.toLocaleLowerCase().startsWith(state.text),
    );
    if (match !== undefined) setActiveIndex(match);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, last));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
        return;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        return;
      case "End":
        event.preventDefault();
        setActiveIndex(last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(activeIndex);
        return;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        close(true);
        return;
      case "Tab":
        close(false);
        return;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          typeAhead(event.key);
        }
    }
  };

  const list = (
    <div
      ref={listRef}
      id={listId}
      className="select-field__list"
      role="listbox"
      tabIndex={-1}
      aria-labelledby={labelId}
      aria-activedescendant={optionId(activeIndex)}
      popover={isPopover ? "manual" : undefined}
      data-open={!isPopover && isOpen ? "" : undefined}
      onKeyDown={onListKeyDown}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node | null)) close(false);
      }}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        return (
          <div
            key={option.value}
            id={optionId(index)}
            role="option"
            lang={option.lang}
            aria-selected={isSelected}
            data-active={index === activeIndex}
            className="select-field__option"
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span>{option.label}</span>
            {isSelected && <Check aria-hidden />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={wrapperRef} className={`select-field select-field--${layout}`}>
      <span id={labelId} className={showLabel ? "select-field__label" : "visually-hidden"}>
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className="select-field__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${baseId}-value`}
        onClick={() => (isOpen ? close(false) : open())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!isOpen) open();
          }
        }}
      >
        {icon}
        <span id={`${baseId}-value`} lang={options[selectedIndex]?.lang}>
          {options[selectedIndex]?.label}
        </span>
        <Chevron />
      </button>
      {list}
    </div>
  );
}

export function SelectField(props: SelectFieldProps) {
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  const layout = props.layout ?? "popover";

  if (layout === "popover" && !hasFinePointer) return <NativeSelect {...props} />;
  return <CustomSelect {...props} />;
}
