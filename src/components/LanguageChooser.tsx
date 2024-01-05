import {
  ActionIcon,
  Box,
  Button,
  ButtonGroup,
  Center,
  CheckIcon,
  Combobox,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxSearch,
  ComboboxTarget,
  Group,
  ScrollAreaAutosize,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { ArrowRight, ArrowRightLeft, ArrowUpDown } from "lucide-react";
import cx from "classnames";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { languages } from "@/app/api/languages";

interface LanguageChooserProps {
  className?: string;
  onChange?: (val?: { from: string; to: string }) => void;
}
export const LanguageChooser = memo(function LanguageChooser(
  props: LanguageChooserProps
) {
  const { className, onChange } = props;
  const maxSelectedOptions = 2;

  const [selectedOptions, setSelectedOptions] = useState<typeof languages>([
    { code: "en", name: "English" },
    { code: "tr", name: "Turkish" },
  ]);

  const isLanguagePairSelected = useMemo(
    () => selectedOptions.length === 2,
    [selectedOptions.length]
  );

  const languagePairObject = useMemo(
    () =>
      isLanguagePairSelected
        ? { from: selectedOptions[0].code, to: selectedOptions[1].code }
        : undefined,
    [isLanguagePairSelected, selectedOptions]
  );

  useEffect(() => {
    onChange?.(languagePairObject);
  }, [languagePairObject, onChange]);

  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch("");
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const selectedOptionsMarkup = useMemo(
    () =>
      selectedOptions.map((language) => (
        <ComboboxOption key={language.code} value={language.code}>
          <Group gap="xs">
            <CheckIcon size="12" />
            <span>{language.name}</span>
          </Group>
        </ComboboxOption>
      )),
    [selectedOptions]
  );

  const availableLanguages = useMemo(
    () =>
      languages.filter(
        (language) =>
          !selectedOptions.some((option) => option.code === language.code)
      ),
    [selectedOptions]
  );

  const optionsMarkup = useMemo(
    () =>
      availableLanguages
        .filter(
          (language) =>
            search === "" ||
            language.name.toLowerCase().includes(search.toLowerCase()) ||
            language.code.toLowerCase().includes(search.toLowerCase())
        )
        .map((language) => {
          const selected = selectedOptions.some(
            (option) => option.code === language.code
          );

          return (
            <ComboboxOption key={language.code} value={language.code}>
              <Group gap="xs">
                {selected && <CheckIcon size="12" />}
                <span>{language.name}</span>
              </Group>
            </ComboboxOption>
          );
        }),
    [availableLanguages, search, selectedOptions]
  );

  const handleSelect = useCallback((val?: string) => {
    if (val) {
      setSelectedOptions((prev) => {
        if (prev.some((option) => option.code === val)) {
          return prev.filter((option) => option.code !== val);
        }

        const newLang = languages.find((language) => language.code === val);
        if (newLang) {
          const [lang1, lang2] = prev;

          return [lang1, newLang].filter(Boolean);
        }

        return prev;
      });
    }
    setSearch("");
  }, []);

  const handleSwapLanguages = useCallback(() => {
    setSelectedOptions((prev) => [prev[1], prev[0]]);
  }, []);

  return (
    <Combobox
      width={400}
      store={combobox}
      styles={{
        dropdown: { width: "400" },
        search: { border: "orange" },
      }}
      withArrow
      onOptionSubmit={handleSelect}
    >
      <Group gap="xs" align="flex-end">
        <ComboboxTarget targetType="button">
          <Tooltip label="Choose languages">
            <Button
              variant="filled"
              className={cx("self-end", className)}
              onClick={() => combobox.toggleDropdown()}
            >
              <span className="w-5">
                {selectedOptions[0]?.code?.toUpperCase()}
              </span>
              <ArrowRight size="1rem" />
              <span className="w-5">
                {selectedOptions[1]?.code?.toUpperCase()}
              </span>
            </Button>
          </Tooltip>
        </ComboboxTarget>
        <Tooltip label="Swap languages">
          <Button
            onClick={handleSwapLanguages}
            disabled={!isLanguagePairSelected}
          >
            <ArrowRightLeft size="1rem" />
          </Button>
        </Tooltip>
      </Group>
      <ComboboxDropdown>
        <ComboboxOptions mah={200} className="overflow-y-auto">
          {optionsMarkup.length ? (
            <ScrollAreaAutosize type="scroll">
              {optionsMarkup}
            </ScrollAreaAutosize>
          ) : (
            <ComboboxEmpty>Nothing found</ComboboxEmpty>
          )}
        </ComboboxOptions>
        <Box className="flex items-center mb-1 pt-1 border-y m-0 border-slate-300">
          <Box className="flex-1">{selectedOptionsMarkup}</Box>
          <Center p="sm">
            <Tooltip label="Swap languages">
              <ActionIcon
                size="md"
                onClick={handleSwapLanguages}
                disabled={!isLanguagePairSelected}
              >
                <ArrowUpDown />
              </ActionIcon>
            </Tooltip>
          </Center>
        </Box>
        <ComboboxSearch
          placeholder="Search..."
          className="border-0"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </ComboboxDropdown>
    </Combobox>
  );
});
