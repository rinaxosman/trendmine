import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DEFAULT_SUBREDDITS } from '@/types/trendmine';

const ALL_SUBREDDITS = [
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
  const toggleSubreddit = (sub: string) => {
    if (value.includes(sub)) {
      onChange(value.filter(s => s !== sub));
    } else {
      onChange([...value, sub]);
    }
  };

  const removeSubreddit = (sub: string) => {
    onChange(value.filter(s => s !== sub));
  };

  return (
    <div className="space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            Select subreddits ({value.length} selected)
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 max-h-64 overflow-auto">
          {ALL_SUBREDDITS.map(sub => (
            <DropdownMenuCheckboxItem
              key={sub}
              checked={value.includes(sub)}
              onCheckedChange={() => toggleSubreddit(sub)}
            >
              r/{sub}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
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
