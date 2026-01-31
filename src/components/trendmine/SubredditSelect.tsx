import { useState } from 'react';
import { X, Check, Plus, ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DEFAULT_SUBREDDITS } from '@/types/trendmine';
import { cn } from '@/lib/utils';

const SUGGESTED_SUBREDDITS = [
  ...DEFAULT_SUBREDDITS,
  'entrepreneur',
  'business',
  'investing',
  'saas',
  'dropship',
  'freelance',
  'digitalnomad',
  'webdev',
  'programming',
  'machinelearning',
  'artificial',
];

interface SubredditSelectProps {
  value: string[];
  onChange: (val: string[]) => void;
}

export function SubredditSelect({ value, onChange }: SubredditSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const toggleSubreddit = (sub: string) => {
    const normalized = sub.toLowerCase().trim();
    if (!normalized) return;

    if (value.includes(normalized)) {
      onChange(value.filter(s => s !== normalized));
    } else {
      onChange([...value, normalized]);
    }
  };

  const addCustomSubreddit = () => {
    const normalized = searchValue.toLowerCase().trim().replace(/^r\//, '');
    if (normalized && !value.includes(normalized)) {
      onChange([...value, normalized]);
      setSearchValue('');
    }
  };

  const removeSubreddit = (sub: string) => {
    onChange(value.filter(s => s !== sub));
  };

  // Check if search value is a new custom subreddit
  const normalizedSearch = searchValue.toLowerCase().trim().replace(/^r\//, '');
  const isCustomSubreddit = normalizedSearch &&
    !SUGGESTED_SUBREDDITS.includes(normalizedSearch) &&
    !value.includes(normalizedSearch);

  // Filter suggestions based on search
  const filteredSuggestions = SUGGESTED_SUBREDDITS.filter(sub =>
    sub.toLowerCase().includes(normalizedSearch)
  );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value.length > 0
              ? `${value.length} subreddit${value.length > 1 ? 's' : ''} selected`
              : 'Search or add subreddits...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search subreddits..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              {/* Show option to add custom subreddit */}
              {isCustomSubreddit && (
                <CommandGroup heading="Add custom">
                  <CommandItem
                    onSelect={addCustomSubreddit}
                    className="cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add r/{normalizedSearch}
                  </CommandItem>
                </CommandGroup>
              )}

              {/* Suggested subreddits */}
              {filteredSuggestions.length > 0 ? (
                <CommandGroup heading="Suggested">
                  {filteredSuggestions.map(sub => (
                    <CommandItem
                      key={sub}
                      onSelect={() => toggleSubreddit(sub)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.includes(sub) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      r/{sub}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                !isCustomSubreddit && (
                  <CommandEmpty>No subreddits found.</CommandEmpty>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected subreddits badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map(sub => (
            <Badge key={sub} variant="secondary" className="gap-1">
              r/{sub}
              <button
                type="button"
                onClick={() => removeSubreddit(sub)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
