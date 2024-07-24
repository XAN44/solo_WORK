import Link from "next/link";

import { Button } from "../../button";
import clsx from "clsx";

interface CardBody {
  title: string;
  content: string;
  subContent: string;
  href?: string;
  color: string;
}

export default function CardBar({
  content,
  title,
  href,
  subContent,
  color,
}: CardBody) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 text-center text-white">
      <div className={clsx(color)}>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm">{content}</p>
        {href && (
          <Link href={href || ""}>
            <Button variant="ghost">{subContent}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
